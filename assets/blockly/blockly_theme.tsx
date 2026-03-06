import * as BlocklyCore from 'blockly/core';

export const DarkModeTheme: BlocklyCore.Theme = BlocklyCore.Theme.defineTheme('DarkMode', {
  name: 'DarkMode',
  base: BlocklyCore.Themes.Zelos,
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
  startHats: true,
});