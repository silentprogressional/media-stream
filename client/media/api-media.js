import config from "../../config/config";

const create = async (params, credentials, media) => {
  try {
    let response = await fetch("/api/media/new/" + params.userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: media,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create };
