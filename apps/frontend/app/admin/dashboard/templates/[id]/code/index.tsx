import { Template } from "@/rspc/bindings"
import 'codemirror/theme/ttcn.css'
import { UnControlled as CodeMirror } from "react-codemirror2"
import 'codemirror/mode/htmlmixed/htmlmixed'
import "codemirror/addon/hint/show-hint.css";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/lint/lint";
import "codemirror/addon/display/autorefresh";

interface Props {
    template: Template
}

const CodeDesigner = (props: Props) => {
    const handleChange = (editor: any, data: any, value: any) => {
        editor.showHint({ completeSingle: false });
    };
    return (
        <div className="h-full w-full overflow-y-auto">
            <CodeMirror
                autoScroll
                value={props.template.content}

                options={{
                    mode: 'htmlmixed',
                    theme: 'ttcn',
                    lineNumbers: true,
                    lineWrapping: true,
                    smartIndent: true,

                    autoCloseBrackets: true,
                    autoRefresh: true,

                    extraKeys: { "Ctrl-Space": "autocomplete" }

                }}

                onChange={handleChange as any}

            />
        </div>
    )
}

export default CodeDesigner