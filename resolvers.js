const goalsResolver = () => {
  return [
    {
      title: "Play Piano",
      cadence: "weekly",
      cadenceCount: 4,
      totalCount: 25,
      timeStamps: ["2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z"],
    },
    {
      title: "Do Yoga",
      cadence: "weekly",
      cadenceCount: 1,
      totalCount: 9,
      timeStamps: ["2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z"],
    },
    {
      title: "Call Sister",
      cadence: "monthly",
      cadenceCount: 6,
      totalCount: 54,
      timeStamps: ["2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z"],
    },
    {
      title: "Work Out",
      cadence: "weekly",
      cadenceCount: 4,
      totalCount: 4,
      timeStamps: ["2011-03-20T00:18:56Z", "2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z"],
    },
    {
      title: "Study JS",
      cadence: "daily",
      cadenceCount: 2,
      totalCount: 11,
      timeStamps: ["2011-03-18T00:18:56Z", "2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z"],
    },
    {
      title: "Read",
      cadence: "daily",
      cadenceCount: 3,
      totalCount: 4,
      timeStamps: ["2011-03-19T00:18:56Z", "2011-03-21T00:18:56Z", "2011-03-21T00:18:56Z"],
    },
  ];
};

const resolvers = {
  Query: { goals: goalsResolver },
};
module.exports = resolvers;
