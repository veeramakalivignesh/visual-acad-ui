export default `
graph TD
A[Start] --> B{"Is n or W zero?"}
B -->|Yes| C("Return 0")
B -->|No| D{"Is weight of nth item > W?"}
D -->|Yes| E("Call knapSack without nth item")
D -->|No| F{"Consider maximum value"}
F -->|Include nth item| G("Recursively call knapSack excluding nth item")
F -->|Exclude nth item| H("Recursively call knapSack")
G --> I("Return maximum value")
H --> I("Return maximum value")
I --> J("Return result")
`;
