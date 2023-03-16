const axios = require("axios");
module.exports = class Handler {
  constructor({ RekognitionService }) {
    this.Rekog = RekognitionService;
  }

  async getImageBuffer(url) {
    const { data } = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(data, "base64");
    return buffer;
  }

  async detectTextImage(imageBuffer) {
    const result = await this.Rekog.detectText({
      Image: {
        Bytes: imageBuffer,
      },
    }).promise();

    const text = result.TextDetections.filter((object) => object.Type == "LINE")
      .map((object) => object.DetectedText)
      .join("\n");

    return text;
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters;
      if (!imageUrl)
        return {
          statusCode: 404,
          response: JSON.stringify({ message: "Imagem inválida" }),
        };
      const imageBuffer = await this.getImageBuffer(imageUrl);
      const text = await this.detectTextImage(imageBuffer);
      return {
        statusCode: 200,
        body: text,
      };
    } catch (error) {
        return {
            statusCode: 500,
            body: text,
          };
    }
  }
};
