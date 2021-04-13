import Client from "../Client";

export default (app: Client) => {
  app.on("hookImportFailed", () => {
    // console.log('Hook import fail');
  });
};
