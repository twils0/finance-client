const handleErrorCatch = (errorCatch) => {
  let error = null;

  if (
    typeof errorCatch === 'object' &&
    errorCatch &&
    errorCatch.response &&
    errorCatch.response.data &&
    errorCatch.response.data.errorMessage
  ) {
    const { errorMessage } = errorCatch.response.data;

    const [, errorString] = errorMessage.split(/[\s]*\[[0-9][0-9][0-9]\][\s]*/g, 2);
    const errorJSON = JSON.parse(errorString);

    ({ error } = errorJSON.body);
  } else {
    error = errorCatch;
  }

  return error;
};

export default handleErrorCatch;
