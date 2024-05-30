ARG NODE_VER=16.19.0-alpine3.16

FROM node:${NODE_VER}

WORKDIR /app

RUN apk update && apk add --no-cache curl vim rsync openssh-client openssh openssh-server-pam dumb-init

COPY yarn.lock .
COPY tsconfig.json .
COPY package.json .
COPY .babelrc .
COPY .eslintrc.js .
RUN mkdir packages
COPY packages/common packages/common
COPY packages/nature-digital-web packages/nature-digital-web
COPY assets assets

RUN chown -R node:node /app

USER node

RUN mkdir /home/node/.ssh
RUN echo 'ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6Em1uXHQ9a1VG38hzOUSQRi/AQJbk19OvKF1xQNiIth9SGCG5t1XLSm7PoQs+jCr6Nkcu7j/+12KSMXaM46LqEttdjMXl1i75ybMdP0MkgvZHHa9oXaWwNWl/YmiqWQRxgbnUIbg3zyy549Gxgj5MW82mwkWKyG49QFQMhamHuefXGTf2SWk3oo/5m3m4Z54a5zB8bEnVYqF1XIRTyACWUfx/SR1YaAjB/7mJ6pGGL0EbohQGc5H4RVK2VdXGpwSuSw9cKZQp3x3/3SorG+3kMP/GjxCyGwa9FoBoARmp9XaZfVHSJ+DvXsCT7PUP1QeSC2lt3QVB7Tb4fdisiWisw== gitlab-runner@vitruvian.studiopresent.info' > /home/node/.ssh/authorized_keys
RUN chmod 700 /home/node/.ssh && chmod 600 /home/node/.ssh/authorized_keys

RUN yarn --ignore-scripts

USER root
RUN ssh-keygen -A
RUN sed -i -e "s/^ *#UsePAM.*/UsePAM yes/g" /etc/ssh/sshd_config
RUN echo 'node:5cWJ$uJPwctAtMS3#jaLAGZEYEhD#p9%LZ&RS&yrD'|chpasswd

RUN echo '#!/bin/sh' > /usr/local/bin/entry.sh
RUN echo '/usr/sbin/sshd -D &' >> /usr/local/bin/entry.sh
RUN echo 'cd /app/packages/nature-digital-web && /usr/local/bin/yarn dev' >> /usr/local/bin/entry.sh
RUN chmod +x /usr/local/bin/entry.sh

EXPOSE 3000

ENV PORT 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["entry.sh"]



