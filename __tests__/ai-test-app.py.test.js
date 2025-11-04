import request from "supertest";
import app from "./app";

describe("/random endpoint", () => {
  it("should return a list of random songs", async () => {
    const res = await request(app).get("/random");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Here are some songs that you may like");
    expect(res.body.songs).toBeInstanceOf(Array);
  });
});