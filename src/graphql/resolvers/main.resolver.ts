
export const queryResolvers = {
  greetings: async () => {
    return "Hello from Yoga in a Bun app!";
  },
  greeting: async () => {
    return "greetings";
  },
};