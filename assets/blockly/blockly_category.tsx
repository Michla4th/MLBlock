export const category = `
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
      icon.style.backgroundRepeat = "no-repeat";
      icon.style.backgroundPosition = "center";
      icon.style.backgroundSize = "70%";

      let svgIcon = '';
      switch (this.name_) {
        case 'Control':
          svgIcon = 'file:///android_asset/jr_green_flag.png';
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

      // icon.innerHTML = svgIcon; 
      icon.style.backgroundImage = 'url(' + svgIcon + ')';
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