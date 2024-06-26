export const LogResponse = (
  topic: string,
  data: any | undefined = undefined
) => {
  console.log("================================");
  console.log(topic);

  if (data) {
    console.log(data);
  }

  console.log("================================");
};
