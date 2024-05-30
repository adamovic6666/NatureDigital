import { FormProps, ObjectOfAny } from "@nature-digital/types";
import axios from "axios";
import React, { useCallback, useRef } from "react";
import useDeepMemo from "../../../hooks/useDeepMemo";
import FormItemWrapper from "./FormItemWrapper";

export function removeEmptyField(obj: ObjectOfAny, fields?: Array<string>): ObjectOfAny {
  if (obj) {
    if (Array.isArray(obj)) {
      return obj
        .map(v => (v && typeof v === "object" ? removeEmptyField(v, fields) : v))
        .filter(v => !(v === null) || !(v === undefined));
    }
    return Object.entries(obj ?? {})
      ?.map(([k, v]) => [k, v && typeof v === "object" ? removeEmptyField(v, fields) : v])
      ?.reduce(
        (a, [k, v]) => (v === null || v === undefined || fields?.some(key => key === k) ? a : (((a as any)[k] = v), a)),
        {},
      );
  }
  return obj;
}

function Form<T>(props: FormProps<T>) {
  const { handleSubmit, children, getFieldState, dirtyFieldsOnly = true } = props;

  const Inputs = useRef<Array<HTMLInputElement | null>>((Array.isArray(children) ? children : [])?.map(() => null));

  const handleDone = useCallback(async data => {
    let changedValues: ObjectOfAny = removeEmptyField(
      dirtyFieldsOnly
        ? Object.entries(data)
            ?.map(([k, v]) => ({ ...getFieldState(k as any), key: k, value: v }))
            ?.reduce((acc, curr) => {
              if (curr?.isDirty) {
                acc[curr.key] = curr.value;
              }
              return acc;
            }, {})
        : data,
    );

    if (props?.onDone) {
      props?.onDone?.(changedValues);
    } else if (Object.values(changedValues)?.length > 0 && props?.uri) {
      // send values in mutation
      if (props?._id) {
        changedValues._id = props?._id;
      }
      if (props?.type) {
        changedValues.type = props?.type;
      }
      if (props?.transformFields instanceof Function) {
        changedValues = props?.transformFields(changedValues);
      }
      const result = await axios.post(props?.uri, JSON.stringify(changedValues)).catch(e => {
        console.log(e?.response?.data?.message, "FORM MUTATION ERROR");
      });

      if (result && result?.status === 200) {
        props?.onResponse?.(result);
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleError = useCallback(errors => {
    console.log(errors, "error");
  }, []);

  const renderItem = useCallback((child, index) => {
    if (child) {
      return (
        <div key={`FORM_KEY_${(child as any)?.props?.name}_${index}_${(child as any)?.key}`}>
          {typeof (child as any)?.props?.name === "string" ? (
            <FormItemWrapper {...props} Inputs={Inputs} index={index} child={child} />
          ) : (
            child
          )}
        </div>
      );
    }
    return null;
    // eslint-disable-next-line
  }, []);

  return (
    <form onSubmit={handleSubmit(handleDone, handleError)}>
      {useDeepMemo(() => React.Children.map(children, renderItem), [props])}
    </form>
  );
}

export default Form;
