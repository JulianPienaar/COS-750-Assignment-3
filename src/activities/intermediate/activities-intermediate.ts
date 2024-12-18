/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import { blocks } from "../../blocks/text";
import { forBlock } from "../../generators/javascript";
import { javascriptGenerator, Order } from "blockly/javascript";
import { save, load } from "../../serialization";
import { toolbox } from "./toolbox";
import "./activities-intermediate.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { showToast } from "../../toast/toast";
// Get the current URL
const url = new URL(window.location.href);

// Create a URLSearchParams object
const params = new URLSearchParams(url.search);

// Get the value of the 'activity' parameter, default to 0 if it doesn't exist
let activity = parseInt(params.get("a") || "0", 10);

function updateQueryParam(newActivity: number) {
  activity = newActivity;

  params.set("a", activity.toString());
  window.history.replaceState({}, "", `${url.pathname}?${params.toString()}`);
  if (instructionDiv) {
    instructionDiv.innerHTML = activityArray[activity]["Instruction"];
  }
  if (activityHeading) {
    activityHeading.textContent = `Activity ${activity + 1}`;
  }

  if (taskHeading) {
    taskHeading.textContent = activityArray[activity]["Title"];
  }

  if(imageElement){
    imageElement.src = "assets/images/Intermediate-" + (activity + 1) + ".jpeg";
  }


  ws.clear();
  delete Blockly.Blocks["input_dropdown"];
  Blockly.defineBlocksWithJsonArray([input_blocks[activity]]);
  javascriptGenerator.forBlock["input_dropdown"] = function (block, generator) {
    const field = block.getFieldValue("FIELDNAME");
    return [`Number(prompt("${field}"))`, Order.ATOMIC];
  };
}

var start = {
  type: "start_block",
  message0: "Begin",
  style: "logic_blocks",
  nextStatement: null,
};

var end = {
  type: "end_block",
  message0: "End",
  style: "logic_blocks",
  previousStatement: null,
};

let input_blocks = [
  {
    type: "input_dropdown",
    message0: "Input %1",
    output: null,
    colour: 65,
    args0: [
      {
        type: "field_dropdown",
        name: "FIELDNAME",
        options: [["X", "x"]],
      },
    ],
  },
  {
    type: "input_dropdown",
    message0: "Input %1",
    colour: 65,
    output: null,
    args0: [
      {
        type: "field_dropdown",
        name: "FIELDNAME",
        options: [["X", "x"]],
      },
    ],
  },
  {
    type: "input_dropdown",
    message0: "Input %1",
    output: null,
    colour: 65,
    args0: [
      {
        type: "field_dropdown",
        name: "FIELDNAME",
        options: [
          ["Target", "target"],
          ["Weekly Savings", "weekly savings"],
        ],
      },
    ],
  },
];

var output_block = {
  type: "output_block",
  message0: "Output %1",
  previousStatement: null,
  colour: 24,
  args0: [
    {
      type: "field_variable",
      name: "VAR",
      variable: "output",
      variableTypes: [""],
    },
  ],
};

Blockly.defineBlocksWithJsonArray([
  start,
  end,
  input_blocks[activity],
  output_block,
]);

javascriptGenerator.forBlock["start_block"] = function (block, generator) {
  return "";
};

javascriptGenerator.forBlock["end_block"] = function (block, generator) {
  return "";
};

javascriptGenerator.forBlock["input_dropdown"] = function (block, generator) {
  const field = block.getFieldValue("FIELDNAME");
  return [`Number(prompt("${field}"))`, Order.ATOMIC];
};

javascriptGenerator.forBlock["output_block"] = function (block, generator) {
  if (generator.nameDB_ === undefined) {
    return "return '';";
  }
  var myvar = generator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Names.NameType.VARIABLE
  );
  console.log(myvar);

  return `return ${myvar};`;
};

const activityArray = [
  {
    Title: "Things aren’t Adding Up",
    Instruction: `Little Johnny is struggling with his homework. He was tasked with adding up all the numbers from 1 to an inputted number x including 1 and x.<br><br>
    Help him by creating a blockly program that allows the input of number x and does this calculation for him.<br>
    <br><b>NOTE</b>: For Inputs, you <b>MUST</b> use the Input block, and the Output <b>MUST</b> use the Output block<br>
`,
    Hint: [
      "You will need to use a loop",
      "Create a variable block outside of the loop block to keep track of the total number",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";
      const expected_output = [{ x: 100 }, { x: 30 }, { x: 23 }];
      for (let i = 0; i < expected_output.length; i++) {
        const element = expected_output[i];
        const mockPrompt = (message: string) => {
          return element["x"];
        };
        const func = new Function("prompt", code);
        const return_value_1: number = func(mockPrompt);
        if (!return_value_1) {
          return false;
        }

        let expected_value = 0;
        for (let i = 1; i <= element["x"]; i++) {
          expected_value += i;
        }

        if (return_value_1 !== expected_value) {
          return false;
        }
      }
      return true;
    },
  },
  {
    Title: "Are We Even Now?",
    Instruction: `Little Johnny is still struggling with his homework. His teacher asked him to add up all the even numbers from 1 to an inputted number x. <br><br>
    Johnny has come and asked you for help. <br><br>

    Create a blockly program that adds together all the even numbers from 1 to x (including 1 and x) to help Johnny.<br>
    <br><b>NOTE</b>: For Inputs, you <b>MUST</b> use the Input block, and the Output <b>MUST</b> use the Output block<br>
`,
    Hint: [
      "Use the even block inside of a loop block",
      "Create a variable block outside of the loop block to keep track of the total number",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";
      const expected_output = [{ x: 100 }, { x: 30 }, { x: 23 }];
      for (let i = 0; i < expected_output.length; i++) {
        const element = expected_output[i];
        const mockPrompt = (message: string) => {
          return element["x"];
        };
        const func = new Function("prompt", code);
        const return_value_1: number = func(mockPrompt);
        if (!return_value_1) {
          return false;
        }

        let expected_value = 0;
        for (let i = 1; i <= element["x"]; i++) {
          if (i % 2 === 0) {
            expected_value += i;
          }
        }

        if (return_value_1 !== expected_value) {
          return false;
        }
      }
      return true;
    },
  },
  {
    Title: "Saving for a Bike",
    Instruction: `Sarah wants to save money to buy a new bike. She sets a target amount and plans to save a certain amount each week. If she reaches her target amount by the end of a week, she wants to stop saving. Otherwise, she’ll keep saving until her goal is met.<br><br>
Create a Blockly program that:<br><br>
- Asks for Sarah's target amount and weekly saving amount.<br>
- Uses a loop to calculate how many weeks it will take for her to reach or exceed her target.<br>
- Outputs the total number of weeks needed.<br>
<br><b>NOTE</b>: For Inputs, you <b>MUST</b> use the Input block, and the Output <b>MUST</b> use the Output block<br>


    `,
    Hint: [
      "Use a variable to keep track of the total saved amount, and update it each loop iteration.",
      "Use an if statement to check if her target has been reached or exceeded.",
      "Think about the case where the target is less than the weekly savings.",
    ],
    checkCode: function () {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;

      if (outputDiv) outputDiv.innerHTML = "";
      const expected_output = [
        { target: 100, "weekly savings": 10 },
        { target: 30, "weekly savings": 5 },
        { target: 23, "weekly savings": 2 },
        { target: 5, "weekly savings": 10 },
      ];
      for (let i = 0; i < expected_output.length; i++) {
        const element = expected_output[i];
        const mockPrompt = (message: string) => {
          if (message.toLowerCase().trim() === "target".toLowerCase().trim()) {
            return element["target"];
          } else if (
            message.toLowerCase().trim() ===
            "weekly savings".toLowerCase().trim()
          ) {
            return element["weekly savings"];
          }
        };

        const func = new Function("prompt", code);
        const return_value_1: number = func(mockPrompt);

        if (!return_value_1) {
          return false;
        }

        let total_saved = 0;
        let weeks = 0;
        while (total_saved < element["target"]) {
          total_saved += element["weekly savings"];
          weeks++;
        }

        if (return_value_1 !== weeks) {
          return false;
        }
      }
      return true;
    },
  },
];

const instructionDiv = document.getElementById("instruction");

if (instructionDiv) {
  instructionDiv.innerHTML = activityArray[activity]["Instruction"];
}

const activityHeading = document.getElementById("activity-heading");

if (activityHeading) {
  activityHeading.textContent = `Activity ${activity + 1}`;
}

const imageElement = document.getElementById("taskImage") as HTMLImageElement;
imageElement.src = "assets/images/Intermediate-" + (activity + 1) + ".jpeg";

const taskHeading = document.getElementById("task-header");

if (taskHeading) {
  taskHeading.textContent = activityArray[activity]["Title"];
}

const goBackButton = document.getElementById("backButton");

if (goBackButton) {
  goBackButton.addEventListener("click", () => {
    navigateTo("difficulty-selection.html");
  });
}

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById("generatedCode")?.firstChild;
const outputDiv = document.getElementById("output");
const blocklyDiv = document.getElementById("blocklyDiv");
const submitButton = document.getElementById("submitButton");
const testButton = document.getElementById("testButton");
const hintButton = document.getElementById("hintButton");

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}
const ws = Blockly.inject(blocklyDiv, { toolbox });

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const testCode = () => {
  const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
  if (codeDiv) codeDiv.textContent = code;

  if (outputDiv) outputDiv.innerHTML = "";

  const func = new Function(code);
  const return_value = func();
  alert(return_value);
};

const submitCode = () => {
  const res = activityArray[activity].checkCode();
  if (res === true) {
    showToast("Correct Answer", "Well done! You got the correct answer.");

    localStorage.setItem(`t${activity + 3}`, "2");

    if (localStorage.getItem(`t${activity + 4}`) !== "2") {
      localStorage.setItem(`t${activity + 4}`, "1");
    }

    if (activity < activityArray.length - 1) {
      updateQueryParam(++activity);
    } else {
      navigateTo("difficulty-selection.html");
    }
  } else {
    showToast(
      "Incorrect Answer",
      "Oh No! You got the incorrect answer. Give it another try."
    );
  }
  return res;
};

var hintIndex = 0;

const giveHint = () => {
  const numHints = activityArray[activity]["Hint"].length;
  showToast("Hint", activityArray[activity]["Hint"][hintIndex++ % numHints]);
};

if (ws) {
  // Load the initial state from storage and run the code.
  load(ws);
  // runCode();

  // Every time the workspace changes state, save the changes to storage.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws);
  });

  // Whenever the workspace changes meaningfully, run the code again.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      ws.isDragging()
    ) {
      return;
    }
  });

  if (testButton) {
    testButton.addEventListener("click", testCode);
  }
  if (submitButton) {
    submitButton.addEventListener("click", submitCode);
  }
  if (hintButton) {
    hintButton.addEventListener("click", giveHint);
  }
}

export function navigateTo(route: string) {
  window.location.href = route;
}

(window as any).navigateTo = navigateTo;
