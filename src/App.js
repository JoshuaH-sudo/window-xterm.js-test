import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "xterm-addon-webgl";

import "xterm/css/xterm.css";
const create_terminal = (container) => {
  const terminal = new Terminal();

  //const unicode11Addon = new Unicode11Addon();
  //terminal.loadAddon(unicode11Addon);
  //terminal.unicode.activeVersion = "11"; // activate the new version
  terminal.open(container);

  const addon = new WebglAddon();
  addon.onContextLoss(() => addon.dispose());
  terminal.loadAddon(addon);

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  fitAddon.fit();
  terminal.write("test");
  return terminal;
};

function App() {
  useEffect(() => {
    //create a normal one
    const container = document.getElementById("normal-container");
    create_terminal(container);
  }, []);

  return (
    <>
      <div id="normal-container" />
      <Window_portal>
        <div id="window-container" />
      </Window_portal>
    </>
  );
}

function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // true for inline styles
      const newStyleEl = sourceDoc.createElement("style");

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // true for stylesheets loaded from a URL
      const newLinkEl = sourceDoc.createElement("link");

      newLinkEl.rel = "stylesheet";
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

const Window_portal = ({ children, onOpen, onUnload }) => {
  const [container, setContainer] = useState(null);
  const newWindow = useRef(window);

  useEffect(() => {
    const div = document.createElement("div");
    setContainer(div);
  }, []);

  useEffect(() => {
    if (container) {
      newWindow.current = window.open(
        "",
        "",
        "width=600,height=400,left=200,top=200"
      );
      newWindow.current.document.body.appendChild(container);
      const curWindow = newWindow.current;

      copyStyles(document, newWindow.current.document);

      //reference to the new window's document, so it looks for the correct element
      let window_container =
        newWindow.current.document.getElementById("window-container");
      if (window_container) create_terminal(window_container);

      return () => {
        curWindow.close();
      };
    }
  }, [container]);

  return container && createPortal(children, container);
};

export default App;
