import Axios from "../../utils/Axios";

/** Send a message to the store support bot. Throws { code, reply?, status } on failure. */
export const sendStoreChat = async ({ message, history, sessionId }) => {
  try {
    const res = await Axios.post("/bots/store/chat", { message, history, sessionId });
    return res.data;
  } catch (error) {
    const data = error.response?.data || {};
    throw { code: data.code || "ERROR", reply: data.reply, status: error.response?.status };
  }
};
