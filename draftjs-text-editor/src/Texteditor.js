import React, { useState, useEffect } from 'react';
import { Editor, EditorState, Modifier, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './TextEditor.css';

const TextEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    // Load content from localStorage on component mount
    const savedContent = localStorage.getItem('editorContent');
    return savedContent
      ? EditorState.createWithContent(ContentState.createFromText(savedContent))
      : EditorState.createEmpty();
  });

  useEffect(() => {
    // Save content to localStorage whenever the editor state changes
    const contentState = editorState.getCurrentContent();
    const contentText = contentState.getPlainText();
    localStorage.setItem('editorContent', contentText);
  }, [editorState]);

  const handleBeforeInput = (chars, editorState) => {
    let newEditorState = editorState;

    if (chars === ' ') {
      const selection = newEditorState.getSelection();
      const contentState = newEditorState.getCurrentContent();
      const blockKey = selection.getStartKey();
      const block = contentState.getBlockForKey(blockKey);
      const text = block.getText();

      if (text.startsWith('# ')) {
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 2,
          }),
          text.slice(2),
          undefined,
          ContentState.createFromText(text.slice(2)).getBlockForKey(blockKey).getInlineStyleAt(0).add('heading-text')
        );

        newEditorState = EditorState.push(newEditorState, newContentState, 'insert-characters');
      } 
    }

    if (newEditorState !== editorState) {
      setEditorState(newEditorState);
      return 'handled';
    }

    return 'not-handled';
  };

  const blockStyleFn = (contentBlock) => {
    const text = contentBlock.getText();
    
    if (text.startsWith('# ')) {
      return 'heading-text';
    } else if (text.startsWith('* ')) {
      return 'bold-text';
    } else if (text.startsWith('** ')) {
      return 'red-text';
    } else if (text.startsWith('*** ')) {
      return 'underline-text';
    }

    return null;
  };

  const handleSave = () => {
    // Save content to localStorage when the "Save" button is clicked
    const contentState = editorState.getCurrentContent();
    const contentText = contentState.getPlainText();
    localStorage.setItem('editorContent', contentText);
  };

  return (
    <React.Fragment>
    <button className="button" onClick={handleSave}>Save</button>
    <div className="text-editor-container">
      
      <div className="editor">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          blockStyleFn={blockStyleFn}
        />
      </div>
      
    </div>
    </React.Fragment>
  );
};

export default TextEditor;
