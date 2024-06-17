import React from 'react';
import DocViewer from "@cyntler/react-doc-viewer";
import {Result, Spin} from "antd";

const PDFViewer = ({file}) => {
    const stuff = [{ uri: file}]

    try {
        return (
            <DocViewer
                documents={stuff}
                config={{
                    noRenderer: {
                        default: true,
                        overrideComponent: ({document, fileName}) => {
                            console.error("--------no renderer", document, fileName)
                            const fileText = fileName || document?.fileType || "";
                            if (fileText) {
                                return <Result
                                    status="error"
                                    title="Document load failed"
                                    subtitle={`No document for ${fileText}`}
                                />
                            }
                            return <div>no renderer</div>;
                        }
                    },
                    loadingRenderer: {
                        overrideComponent: ({document, fileName}) => {
                            const fileText = fileName || document?.fileType || "";
                            if (fileText) {
                                return <div className="d-flex justify-content-end">
                                    <Spin tip={`Loading (${fileText})`}/>
                                </div>
                            }
                            return <div className="d-flex justify-content-end">
                                <Spin tip="Loading" />
                            </div>;
                        }
                    },
                    pdfZoom: {
                        defaultZoom: 0.6,
                        zoomJump: 0.2
                    }
                }}
            />
        );
    } catch (e) {
        console.log("failed")
        return "failed to load doc"
    }
}
export default PDFViewer;