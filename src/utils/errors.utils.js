export function checkFsspError(response) {
  if (response.data?.error) {
    throw new Error(response.data.error);
  }
}
