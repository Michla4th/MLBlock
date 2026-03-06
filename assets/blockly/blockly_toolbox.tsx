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