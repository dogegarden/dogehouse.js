import Client from "../Client";

export default (app: Client) => {
  app.on("hookImportSuccess", () => {
    // console.log('Hook Import Success');
  });
};
