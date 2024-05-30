let timer: NodeJS.Timeout;

function debounce(func, timeout = 1500) {
  clearTimeout(timer);

  timer = setTimeout(() => {
    func();
  }, timeout);
}

export default debounce;
