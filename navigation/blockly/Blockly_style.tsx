export const custom_category = `
  class CustomCategory extends Blockly.ToolboxCategory {
    /**
     * Constructor for a custom category.
     * @override
     */
    constructor(categoryDef, toolbox, opt_parent) {
      super(categoryDef, toolbox, opt_parent);
    }

    /**
     * Adds the colour to the toolbox.
     * This is called on category creation and whenever the theme changes.
     * @override
     */

    addColourBorder_(colour) {
      this.rowDiv_.style.backgroundColor = "#575F75";
    }

    /**
     * Sets the style for the category when it is selected or deselected.
     * @param {boolean} isSelected True if the category has been selected,
     *     false otherwise.
     * @override
     */
    setSelected(isSelected) {
      // We do not store the label span on the category, so use getElementsByClassName.
      const labelDom = this.rowDiv_.getElementsByClassName(
        'blocklyToolboxCategoryLabel',
      )[0];
      if (isSelected) {
        // Change the background color of the div to white.
        this.rowDiv_.style.backgroundColor = '#414759'; //'white';
        // Set the colour of the text to the colour of the category.
        labelDom.style.color = '#ffffff';// this.colour_;
        this.iconDom_.style.color = this.colour_;
      } else {
        // Set the background back to the original colour.
        this.rowDiv_.style.backgroundColor = '#575F75'// this.colour_;
        // Set the text back to white.
        // labelDom.style.color = '#ffffff';// 'white';
        // this.iconDom_.style.color = 'white';
      }
      // This is used for accessibility purposes.
      Blockly.utils.aria.setState(
        /** @type {!Element} */ (this.htmlDiv_),
        Blockly.utils.aria.State.SELECTED,
        isSelected,
      );
    }

    /**
     * Creates the dom used for the icon.
     * @returns {HTMLElement} The element for the icon.
     * @override
     */

    createIconDom_() {
      // const iconImg = document.createElement('img');
      // iconImg.src = wrapper;
      // iconImg.alt = 'Blockly Logo';
      // iconImg.width = '25';
      // iconImg.height = '25';
      // return iconImg;

      const icon = document.createElement('div');
      icon.style.width = '30px';
      icon.style.height = '30px';
      icon.style.borderRadius = '50%';
      icon.style.backgroundColor = this.colour_; // Màu theo category
      icon.style.border = '1.5px solid #373C4C';
      icon.style.marginRight = '8px';

      let svgIcon = '';
      switch (this.name_) {
        case 'Logic':
          svgIcon = '';
          break;
        case 'Loops':
          svgIcon = '';
          break;
        case 'Math':
          svgIcon = '';
          break;
        case 'Text':
          svgIcon = '';
          break;
        case 'Lists':
          svgIcon = '';
          break;
      }

      icon.innerHTML = svgIcon; 
      return icon;
    }
  }

  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    CustomCategory,
    true,
  );  
`

export const toolbox_label = `
  class ToolboxLabel extends Blockly.ToolboxItem {
    /**
     * Constructor for a label in the toolbox.
     * @param {!Blockly.utils.toolbox.ToolboxItemInfo} toolboxItemDef The toolbox
     *    item definition. This comes directly from the toolbox definition.
     * @param {!Blockly.IToolbox} parentToolbox The toolbox that holds this
     *    toolbox item.
     * @override
     */
    constructor(toolboxItemDef, parentToolbox) {
      super(toolboxItemDef, parentToolbox);
      /**
       * The button element.
       * @type {?HTMLLabelElement}
       */
      this.label = null;
    }

    /**
     * Init method for the label.
     * @override
     */
    init() {
      // Create the label.
      this.label = document.createElement('label');
      // Set the name.
      this.label.textContent = this.toolboxItemDef_['name'];
      // Set the color.
      this.label.style.color = this.toolboxItemDef_['colour'];
      // Any attributes that begin with css- will get added to a cssconfig.
      const cssConfig = this.toolboxItemDef_['cssconfig'];
      // Add the class.
      if (cssConfig) {
        this.label.classList.add(cssConfig['label']);
      }
    }

    /**
     * Gets the div for the toolbox item.
     * @returns {HTMLLabelElement} The label element.
     * @override
     */
    getDiv() {
      return this.label;
    }
  }

  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    'toolboxlabel',
    ToolboxLabel,
  );
`

export const toolbox_style = `
  /* Makes our label white. */
  .blocklyToolboxCategoryLabel {
    color: #fff;
  }
  /* Adds padding around the group of categories and separators. */
  .blocklyToolboxContents {
    padding: 0.5em;
  }
  /* Adds space between the categories, rounds the corners and adds space around the label. */
  .blocklyToolboxCategory {
    padding: 3px;
    // margin-bottom: 0.5em;
    margin-top: 0.5em;
    // border-radius: 10px;
    
  }
  /* Changes color of the icon to white. */
  .customIcon {
    color: #fff;
  }
  /* Stacks the icon on top of the label. */
  .blocklyTreeRowContentContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
  }
  .blocklyToolboxCategory {
    height: initial;
    width: 140;
  }
  .blocklyToolbox{
    padding-top: 55px;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }    
  .blocklyFlyout{}
  .blocklyFlyoutScrollbar{}
`

export const Blockly_Block = `
  Blockly.defineBlocksWithJsonArray([
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
      "previousStatement": null,
      "nextStatement": null,
      "colour": 200
    }
  ]);
`

import * as BlocklyCore from 'blockly/core';

export const DarkModeTheme: BlocklyCore.Theme = BlocklyCore.Theme.defineTheme('DarkMode', {
  name: 'DarkMode',
  base: BlocklyCore.Themes.Classic,
  // categoryStyles: {
  //   list_category: {
  //     colour: '#4a148c',
  //   },
  //   logic_category: {
  //     colour: '#8b4513',
  //   },
  //   loop_category: {
  //     colour: '#85E21F',
  //   },
  //   text_category: {
  //     colour: '#FE9B13',
  //   },
  // },
  // blockStyles: {
  //   list_blocks: {
  //     colourPrimary: '#4a148c',
  //     colourSecondary: '#AD7BE9',
  //     colourTertiary: '#CDB6E9',
  //   },
  //   logic_blocks: {
  //     colourPrimary: '#8b4513',
  //     colourSecondary: '#ff0000',
  //     colourTertiary: '#C5EAFF',
  //   },
  //   loop_blocks: {
  //     colourPrimary: '#85E21F',
  //     colourSecondary: '#ff0000',
  //     colourTertiary: '#C5EAFF',
  //   },
  //   text_blocks: {
  //     colourPrimary: '#FE9B13',
  //     colourSecondary: '#ff0000',
  //     colourTertiary: '#C5EAFF',
  //   },
  // },
  componentStyles: {
    workspaceBackgroundColour: '#414759',
    toolboxBackgroundColour: '#575F75',
    // toolboxForegroundColour: '#575F75',
    flyoutBackgroundColour: '#535A70',
    // flyoutForegroundColour: '#575F75',
    flyoutOpacity: 0.6,
    scrollbarColour: '#373C4C',
    // insertionMarkerColour: '#575F75',
  //   insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.3,
  //   cursorColour: '#575F75',
  },
});


