/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from "react";

const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "SPAN", "BR", "DIV", "P", "IMG"]);
const IMAGE_SRC = /^(data:image\/(png|jpe?g|gif|webp);base64,|https:\/\/)/i;

const escapeText = (value) => {
  const container = document.createElement("div");
  container.textContent = value;
  return container.innerHTML.replace(/\n/g, "<br>");
};

export function sanitizeRichText(value) {
  if (!value) return "";
  if (!/<\/?(b|strong|i|em|span|br|div|p|img)(\s|>|\/)/i.test(value)) return escapeText(value);

  const root = document.createElement("div");
  root.innerHTML = value;
  const cleanNode = (node) => {
    [...node.childNodes].forEach(cleanNode);
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (!ALLOWED_TAGS.has(node.tagName)) {
      node.replaceWith(...node.childNodes);
      return;
    }
    const color = node.tagName === "SPAN" ? node.style.color : "";
    const src = node.tagName === "IMG" ? node.getAttribute("src") : "";
    [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
    if (color) node.style.color = color;
    if (node.tagName === "IMG") {
      if (!src || !IMAGE_SRC.test(src)) node.remove();
      else {
        node.setAttribute("src", src);
        node.setAttribute("alt", "Ảnh đính kèm");
      }
    }
  };
  [...root.childNodes].forEach(cleanNode);
  return root.innerHTML;
}

export function RichTextContent({ value, className = "" }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }} />;
}

function RichTextEditor({ id, name, value, onChange, placeholder, ariaLabel }) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const selectionRef = useRef(null);
  const lastValueRef = useRef(null);

  useEffect(() => {
    const nextValue = sanitizeRichText(value);
    if (lastValueRef.current === nextValue) return;
    if (editorRef.current) editorRef.current.innerHTML = nextValue;
    lastValueRef.current = nextValue;
  }, [value]);

  const emitChange = () => {
    const nextValue = editorRef.current?.innerHTML || "";
    lastValueRef.current = nextValue;
    onChange({ target: { name, value: nextValue } });
  };
  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) selectionRef.current = selection.getRangeAt(0).cloneRange();
  };
  const restoreSelection = () => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    const savedRange = selectionRef.current;
    const rangeIsInEditor = savedRange && editor.contains(savedRange.commonAncestorContainer);
    const range = rangeIsInEditor ? savedRange : document.createRange();
    if (!rangeIsInEditor) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    selectionRef.current = range.cloneRange();
  };
  const applyFormat = (command, commandValue = null) => {
    restoreSelection();
    const editor = editorRef.current;
    const range = selectionRef.current;
    if (!editor || !range || !editor.contains(range.commonAncestorContainer)) return;

    // Keep the native command as a fallback for an empty selection, so the
    // formatting applies to text typed next.
    if (range.collapsed) {
      if (command === "foreColor") document.execCommand("styleWithCSS", false, true);
      document.execCommand(command, false, commandValue);
      rememberSelection();
      emitChange();
      return;
    }

    const tagName = command === "bold" ? "STRONG" : command === "italic" ? "EM" : "SPAN";
    const matchesFormat = (element) => {
      if (!element || element === editor) return false;
      if (command === "bold") return element.tagName === "STRONG" || element.tagName === "B";
      if (command === "italic") return element.tagName === "EM" || element.tagName === "I";
      return element.tagName === "SPAN" && Boolean(element.style.color);
    };
    const findFormattedParent = (node) => {
      let current = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
      while (current && current !== editor) {
        if (matchesFormat(current)) return current;
        current = current.parentElement;
      }
      return null;
    };
    const formattedParent = findFormattedParent(range.startContainer);
    const endsInSameFormat = formattedParent && formattedParent.contains(range.endContainer);

    if (command !== "foreColor" && endsInSameFormat) {
      const parent = formattedParent.parentNode;
      formattedParent.replaceWith(...formattedParent.childNodes);
      const updatedRange = document.createRange();
      updatedRange.selectNodeContents(parent);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(updatedRange);
      selectionRef.current = updatedRange.cloneRange();
    } else if (command === "foreColor" && endsInSameFormat) {
      formattedParent.style.color = commandValue;
      selectionRef.current = range.cloneRange();
    } else {
      const wrapper = document.createElement(tagName.toLowerCase());
      if (command === "foreColor") wrapper.style.color = commandValue;
      wrapper.append(range.extractContents());
      range.insertNode(wrapper);
      const updatedRange = document.createRange();
      updatedRange.selectNodeContents(wrapper);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(updatedRange);
      selectionRef.current = updatedRange.cloneRange();
    }
    rememberSelection();
    emitChange();
  };
  const applyToolbarFormat = (event, command) => {
    // Execute on pointer down, before the browser can move focus away from the selected text.
    event.preventDefault();
    applyFormat(command);
  };
  const insertImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 350 * 1024) {
      window.alert("Ảnh cần nhỏ hơn 350 KB để có thể lưu cùng công việc.");
      return;
    }
    const imageData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    applyFormat("insertImage", imageData);
  };

  return <div className="rich-text-editor">
    <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Định dạng mô tả">
      <button type="button" aria-label="In đậm" title="In đậm" onPointerDown={(event) => applyToolbarFormat(event, "bold")}><i className="fa-solid fa-bold" /></button>
      <button type="button" aria-label="In nghiêng" title="In nghiêng" onPointerDown={(event) => applyToolbarFormat(event, "italic")}><i className="fa-solid fa-italic" /></button>
      <label className="rich-text-editor__color" title="Màu chữ"><i className="fa-solid fa-palette" /><input type="color" aria-label="Màu chữ" defaultValue="#334155" onPointerDown={rememberSelection} onChange={(event) => applyFormat("foreColor", event.currentTarget.value)} /></label>
      <button type="button" aria-label="Chèn ảnh" title="Chèn ảnh" onPointerDown={(event) => event.preventDefault()} onClick={() => imageInputRef.current?.click()}><i className="fa-regular fa-image" /></button>
      <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={insertImage} />
    </div>
    <div id={id} ref={editorRef} className="rich-text-editor__input" contentEditable role="textbox" aria-label={ariaLabel} aria-multiline="true" data-placeholder={placeholder} onInput={emitChange} onKeyUp={rememberSelection} onMouseUp={rememberSelection} onBlur={rememberSelection} />
  </div>;
}

export default RichTextEditor;
