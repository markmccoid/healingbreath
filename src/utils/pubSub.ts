export function pubSub() {
  const subscribers = {};

  function publish(eventName, data) {
    console.log("pub event, data", subscribers, data);
    if (!Array.isArray(subscribers[eventName])) {
      return;
    }
    subscribers[eventName].forEach((callback) => {
      console.log("in pub", data);
      callback(data);
    });
  }

  function subscribe(eventName, callback) {
    if (!Array.isArray(subscribers[eventName])) {
      subscribers[eventName] = [];
    }
    subscribers[eventName].push(callback);
    const index = subscribers[eventName].length - 1;
    console.log("subscribers", subscribers);
    return () => {
      subscribers[eventName].splice(index, 1);
    };
  }

  return {
    publish,
    subscribe,
  };
}
