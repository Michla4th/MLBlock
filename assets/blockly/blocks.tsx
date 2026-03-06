export const blocks =`
  Blockly.defineBlocksWithJsonArray([
    {
     "type": "green_flag",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_image",
          "src": "file:///android_asset/jr_green_flag.png",
          "width": 40,
          "height": 40,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "MEMBER_VALUE"
        }        
      ],
      "colour": 230, 
      // "inputsInline": true,
    },
    {
      "type": "play_sound",
      "message0": "Play %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "VALUE",
          "options": [
            ["C4", "sounds/c4.m4a"],
            ["D4", "sounds/d4.m4a"],
            ["E4", "sounds/e4.m4a"],
            ["F4", "sounds/f4.m4a"],
            ["G4", "sounds/g4.m4a"]
          ]
        }
      ],
      "previousStatement": true,
      "nextStatement": true,
      "colour": 200
    },
    {
      "type": "object",
      "message0": "{ %1 %2 }",
      "args0": [
        {
          "type": "input_dummy"
        },
        {
          "type": "input_statement",
          "name": "MEMBERS",
        }
      ],
      "output": 'number',
      "colour": 230,
    },
    {
      "type": "member",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_image",
          "src": "file:///android_asset/jr_green_flag.png",
          "width": 40,
          "height": 40,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "MEMBER_VALUE"
        },
      ],
      "nextStatement": true,
      "colour": 230,  
      "output": 'number', 
    },
    {
      "type": "member2",
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_image",
          "src": "file:///android_asset/jr_green_flag.png",
          "width": 40,
          "height": 40,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "MEMBER_VALUE"
        },
      ],
      "colour": 230,  
      "output": 'number', 
    }
  ]);
`

export const esp_blocks =`
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "print",
      "message0": "print %1",
      "args0": [
        {
          "type": "input_value",
          "name": "TEXT",
          "value": "Hello World"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 160,
      "tooltip": "Print text to console",
      "helpUrl": ""
    },
    {
      "type": "delay",
      "message0": "delay %1 seconds",
      "args0": [
        {
          "type": "field_number",
          "name": "SECS",
          "value": 1,
          "min": 0
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Delay for n seconds",
      "helpUrl": ""
    },
    // Event
    {
      "type": "event_begin",
      "message0": "When Start %1", 
      "args0": [
        {
          "type": "input_dummy"
        },
      ],     
      "nextStatement": null,  
      "colour": "#FFAB19",            
      "hat": "cap",    
    },
    {
      "type": "event_forever",
      "message0": "forever %1 %2", 
      "args0": [
        {
          "type": "input_dummy" 
        },
        {
          "type": "input_statement", 
          "name": "DO"               
        }
      ],
      "previousStatement": null,
      "nextStatement": null,     
      "colour": "#FFAB19",      
    },
    // Motors
    {
      "type": "motor_run",
      "message0": "Motor %1 run %2 speed to %3 %",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "MOTOR",
          "options": [
            ["M1","M1"],
            ["M2","M2"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "NAME",
          "options": [
            [
              {
                "src": "file:///android_asset/jr_green_flag.png",
                "width": 20,
                "height": 20,
                "alt": "*"
              },
              "RIGHT"
            ],
            [
              {
                "src": "file:///android_asset/jr_green_flag.png",
                "width": 20,
                "height": 20,
                "alt": "*"
              },
              "LEFT"
            ]
          ]
        },
        {
          "type": "input_value",
          "name": "SPEED",    
          "check": "Number"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "",
      "helpUrl": ""
    },
    {
      type: 'test_custom_field_values_max',
      message0: 'max %1',
      args0: [
        {
          type: 'field_slider',
          name: 'FIELDNAME',
          value: 70,
          max: 80,
          alt: {
            type: 'field_label',
            text: 'No field_slider',
          },
        },
      ],
      output: null,
      style: 'math_blocks',
    },

  ]);
`
