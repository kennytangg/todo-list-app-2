import { ok, fail } from "@/lib/api";

describe("ok helper", () => {
  it("returns 200 with success:true and data", async () => {
    const res = ok({ id: "1", title: "Test" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ id: "1", title: "Test" });
  });

  it("accepts custom status code", async () => {
    const res = ok({ id: "1" }, 201);
    expect(res.status).toBe(201);
  });
});

describe("fail helper", () => {
  it("returns 400 with success:false and error message", async () => {
    const res = fail("Invalid input");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid input");
  });

  it("accepts custom status code", async () => {
    const res = fail("Not found", 404);
    expect(res.status).toBe(404);
  });
});
