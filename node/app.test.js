const fetch = require('node-fetch');
const app = require('./app');

const thinkfulApiResponse = {
  '2019-08-04': {
    '2019-08-04T10:30:00-04:00': 319369,
    '2019-08-04T11:00:00-04:00': 319369,
    '2019-08-04T20:00:00-04:00': 319369,
  },
  '2019-08-01': {
    '2019-08-01T11:00:00-04:00': 372955,
    '2019-08-01T19:00:00-04:00': 499660,
    '2019-08-01T21:00:00-04:00': 399956,
    '2019-08-01T02:00:00-04:00': 399956,
    '2019-08-01T10:00:00-04:00': 372955,
    '2019-08-01T12:00:00-04:00': 419054,
  },
};

const formattedThinkfulData = {
  '319369': [
    {
      availability: '2019-08-04T10:30:00-04:00',
      isBooked: false,
      studentName: null,
    },
    {
      availability: '2019-08-04T11:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
    {
      availability: '2019-08-04T20:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '372955': [
    {
      availability: '2019-08-01T11:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
    {
      availability: '2019-08-01T10:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '399956': [
    {
      availability: '2019-08-01T21:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
    {
      availability: '2019-08-01T02:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '419054': [
    {
      availability: '2019-08-01T12:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '499660': [
    {
      availability: '2019-08-01T19:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
};

const bookAppointmentResponse = {
  '319369': [
    {
      availability: '2019-08-04T10:30:00-04:00',
      isBooked: true,
      studentName: 'Foo Bar',
    },
    {
      availability: '2019-08-04T11:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
    {
      availability: '2019-08-04T20:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '372955': [
    {
      availability: '2019-08-01T11:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
    {
      availability: '2019-08-01T10:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '399956': [
    {
      availability: '2019-08-01T21:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
    {
      availability: '2019-08-01T02:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '419054': [
    {
      availability: '2019-08-01T12:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
  '499660': [
    {
      availability: '2019-08-01T19:00:00-04:00',
      isBooked: false,
      studentName: null,
    },
  ],
};

// Mock window fetch
jest.mock('node-fetch');

describe('today', () => {
  it("returns today's formatted date", () => {
    expect(app.today()).toBe(new Date().toLocaleDateString());
  });
});

describe('Fetch Thinkful API data and format response', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('requests data from the Thinkful API', async () => {
    const json = () =>
      Promise.resolve({
        ...thinkfulApiResponse,
      });
    fetch.mockReturnValue(Promise.resolve({ json }));
    const responseData = await app.fetchThinkfulAvailabilityData();
    expect(responseData).toEqual(thinkfulApiResponse);
    expect(fetch).toBeCalledWith(
      'https://www.thinkful.com/api/advisors/availability',
    );
  });

  it('formats the Thinkful API response data', () => {
    expect(app.formatThinkfulData(thinkfulApiResponse)).toEqual(
      formattedThinkfulData,
    );
  });

  it('returns an empty object when no arguments are passed to formatThinkfulData', () => {
    expect(app.formatThinkfulData()).toEqual({});
  });
});
