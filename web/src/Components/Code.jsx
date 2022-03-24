// Component for displaying the R code

import React, { useState } from "react";
import { Button } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { nord as dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { parseModel } from "../Parsers/parseModel.js";

export function Code(props) {
  const codeString = props.model;
  return (
    <span style={{ paddingTop: 50 }}>
      <SyntaxHighlighter
        language="r"
        // style={dracula}
        className="myclass"
        customStyle={{
          marginTop: 0,
          fontWeight: "lighter",
          minWidth: "80ch",
          fontSize: "smaller",
        }}
        wrapLongLines={true}
      >
        {codeString}
      </SyntaxHighlighter>
    </span>
  );
}

export function CopyCode(props) {
  const fullmodel = props.children;
  const desktop = useMediaQuery("(min-width:80ch)");
  const [copied, setCopied] = useState(false);
  const advanced = props.advanced;
  function onCopy() {
    console.info("successfully copied");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }
  return (
    <>
      <CopyToClipboard text={parseModel(fullmodel, advanced)} onCopy={onCopy}>
        <Button color="secondary" variant="contained" id="copy_button">
          {copied ? "Copied" : "Copy model"}
        </Button>
      </CopyToClipboard>
      {desktop && <Code model={parseModel(fullmodel, advanced)} />}
      {!desktop && (
        <div>
          <hr />
          Screen width too small to display model
        </div>
      )}
    </>
  );
}
