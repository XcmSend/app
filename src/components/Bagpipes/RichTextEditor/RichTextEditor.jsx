// @ts-nocheck
import React, { useEffect, useRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; 
import '../../../index.css'
import './quill.css'



// Define custom blot
var Block = Quill.import('blots/block');
class IfStatementBlot extends Block {}
IfStatementBlot.blotName = 'ifStatement';
IfStatementBlot.tagName = 'div';
IfStatementBlot.className = 'if-statement';
Quill.register('formats/ifStatement', IfStatementBlot);

const RichTextEditor = React.forwardRef((props, ref) => {
    const { value, onChange, style } = props;
    const editorRef = useRef();

    // Initialize quillRef to hold Quill instance
    const quillRef = useRef();
    useImperativeHandle(ref, () => ({
        quillRef
    }));

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            const quill = new Quill(editorRef.current, { 
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: ['ifStatement'],
                        handlers: {
                            ifStatement: function() {
                                const range = this.quill.getSelection(true);
                                this.quill.insertText(range.index, 'if() {\n\n}\n', 'ifStatement');
                            }
                        }
                    }
                }
            });
    
            // Set the quillRef value
            quillRef.current = quill;
    
            quill.on('text-change', () => {
                onChange(quill.root.innerHTML);
            });
    
            quill.root.innerHTML = value;
        }
    }, []);
    
    
    
    useEffect(() => {
        if (quillRef.current && quillRef.current.root.innerHTML !== value) {
            quillRef.current.root.innerHTML = value;
        }
    }, [value]);
    
    
    return (
        <>
            <button className="ql-ifStatement"></button>
            <div ref={editorRef} className="main-font "style={{ ...style, height: style?.height || '200px' }} />
        </>
    );
});

export default RichTextEditor;
