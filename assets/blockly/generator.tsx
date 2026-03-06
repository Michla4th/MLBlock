export const pythonGeneratorCode = `
  python.pythonGenerator.STATEMENT_PREFIX = 'highlightBlock(%1); time.sleep(0.01)\\n';
  python.pythonGenerator.addReservedWords('highlightBlock');

  python.pythonGenerator.forBlock["print"] = function(block) {
    const value = python.pythonGenerator.valueToCode(block, "TEXT", python.pythonGenerator.ORDER_NONE) || "''";
    return "print(" + value + ')\\n';
  };

  python.pythonGenerator.forBlock['delay'] = function(block) {
    const secs = block.getFieldValue('SECS');
    python.pythonGenerator.definitions_['import_time'] += 'import time';
    return "time.sleep(" + secs + ")\\n";
  };

  python.pythonGenerator.forBlock['event_begin'] = function(block) {
    python.pythonGenerator.definitions_['import'] = 'import mila';
    python.pythonGenerator.definitions_['setup'] = 'def setup():\\n  mila.begin()\\n';
    return '';
  };  

  python.pythonGenerator.forBlock['event_forever'] = function(block) {
    var statements = python.pythonGenerator.statementToCode(block, 'DO');
    statements = statements || '  pass\\n';
    return 'while True:\\n' + statements;
  };

  dart.dartGenerator.forBlock["print"] = function(block) {return ''};
  lua.luaGenerator.forBlock["print"] = function(block) {return ''};
  php.phpGenerator.forBlock["print"] = function(block) {return ''};
  javascript.javascriptGenerator.forBlock["print"] = function(block) {return ''};

  dart.dartGenerator.forBlock["delay"] = function(block) {return ''};
  lua.luaGenerator.forBlock["delay"] = function(block) {return ''};
  php.phpGenerator.forBlock["delay"] = function(block) {return ''};
  javascript.javascriptGenerator.forBlock["delay"] = function(block) {return ''};

  dart.dartGenerator.forBlock["event_begin"] = function(block) {return ''};
  lua.luaGenerator.forBlock["event_begin"] = function(block) {return ''};
  php.phpGenerator.forBlock["event_begin"] = function(block) {return ''};
  javascript.javascriptGenerator.forBlock["event_begin"] = function(block) {return ''};  

  dart.dartGenerator.forBlock["event_forever"] = function(block) {return ''};
  lua.luaGenerator.forBlock["event_forever"] = function(block) {return ''};
  php.phpGenerator.forBlock["event_forever"] = function(block) {return ''};
  javascript.javascriptGenerator.forBlock["event_forever"] = function(block) {return ''};

`;