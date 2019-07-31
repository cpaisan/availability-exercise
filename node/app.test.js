const request = require("supertest");
const nock = require("nock");
const app = require("./app");

const thinkfulApiResponse = {
  "2019-08-04": {
    "2019-08-04T10:30:00-04:00": 319369,
    "2019-08-04T11:00:00-04:00": 319369,
    "2019-08-04T20:00:00-04:00": 319369
  },
  "2019-08-01": {
    "2019-08-01T11:00:00-04:00": 372955,
    "2019-08-01T19:00:00-04:00": 499660,
    "2019-08-01T21:00:00-04:00": 399956,
    "2019-08-01T02:00:00-04:00": 399956,
    "2019-08-01T10:00:00-04:00": 372955,
    "2019-08-01T12:00:00-04:00": 419054
  }
};

const formattedThinkfulData = {
  "319369": [
    {
      availability: "2019-08-04T10:30:00-04:00",
      isBooked: false,
      studentName: null
    },
    {
      availability: "2019-08-04T11:00:00-04:00",
      isBooked: false,
      studentName: null
    },
    {
      availability: "2019-08-04T20:00:00-04:00",
      isBooked: false,
      studentName: null
    }
  ],
  "372955": [
    {
      availability: "2019-08-01T11:00:00-04:00",
      isBooked: false,
      studentName: null
    },
    {
      availability: "2019-08-01T10:00:00-04:00",
      isBooked: false,
      studentName: null
    }
  ],
  "399956": [
    {
      availability: "2019-08-01T21:00:00-04:00",
      isBooked: false,
      studentName: null
    },
    {
      availability: "2019-08-01T02:00:00-04:00",
      isBooked: false,
      studentName: null
    }
  ],
  "419054": [
    {
      availability: "2019-08-01T12:00:00-04:00",
      isBooked: false,
      studentName: null
    }
  ],
  "499660": [
    {
      availability: "2019-08-01T19:00:00-04:00",
      isBooked: false,
      studentName: null
    }
  ]
};

describe("/today", () => {
  beforeEach(() => {
    nock("https://www.thinkful.com")
      .get("/api/advisors/availability")
      .reply(200, {
        ...thinkfulApiResponse
      });
  });

  it("returns today's formatted date", () => {
    expect(app.today()).toBe(new Date().toLocaleDateString());
  });

  it.skip("returns API data formatted", async () => {
    // TODO: Figure out how to inject mock data into app memory
    const { body: responseData } = await request(app).get("/today");
    const { availability } = responseData;
    expect(availability).toEqual(formattedThinkfulData);
  });
});

describe("/book_appointment", () => {
  beforeEach(() => {
    nock("https://www.thinkful.com")
      .get("/api/advisors/availability")
      .reply(200, {
        ...thinkfulApiResponse
      });
  });
  // TODO: Figure out how to inject mock data into app memory
  it.skip("returns updated advisor availability", async () => {
    const response = await request(app)
      .post("/book_appointment")
      .send({
        studentName: "Foo Bar",
        advisor: "319369",
        availability: "2019-08-01T19:00:00-04:00"
      })
      .set("Accept", "application/json");
  });
});
