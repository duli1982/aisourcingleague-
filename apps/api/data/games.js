export const games = [
  {
    id: 'boolean-blacksmith',
    title: 'Game 1: The Boolean Blacksmith',
    context:
      'Senior Backend Engineer specializing in distributed systems, located in Vienna, Austria. Requires Go (Golang), Kubernetes, and open-source contributions.',
    task:
      'Craft the most effective Boolean search string to surface these candidates on a professional networking site.'
  }
];

export const findGameById = gameId => games.find(game => game.id === gameId);
