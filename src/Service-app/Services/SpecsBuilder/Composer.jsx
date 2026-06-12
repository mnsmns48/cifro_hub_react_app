import {Table, Button} from "antd";
import {useEffect, useState} from "react";
import Spinner from "../../../Cifrotech-app/components/Spinner.jsx";
import {BorderInnerOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {useComposer} from "./hook/useComposer.jsx";
import {useSpecPath} from "./hook/useSpecPath.jsx";


const Composer = ({formulaEntityTypeId, selectedFormula, onEditFormula, onSpecPathChanged}) => {
    const [loading, setLoading] = useState(true);
    const [hoveredRow, setHoveredRow] = useState(null);

    const {
        composerTableData,
        composerColumns,
        isComposerCreating,
        startCreateComposer,
        reloadComposerTable
    } = useComposer({
        formulaEntityTypeId,
        onEditFormula
    });

    const {
        specPathTableData,
        specPathColumns,
        startCreateSpecPath,
        loadSpecPaths
    } = useSpecPath({selectedFormula, onSpecPathChanged});

    useEffect(() => {
        if (!selectedFormula) return;
        void reloadComposerTable();
    }, [selectedFormula]);


    useEffect(() => {
        if (!formulaEntityTypeId) return;
        const load = async () => {
            await reloadComposerTable();
            setLoading(false);
        };
        void load();
    }, [formulaEntityTypeId]);


    useEffect(() => {
        if (!selectedFormula) return;
        const {id} = selectedFormula.formula;
        const {source} = selectedFormula;
        void loadSpecPaths(id, source);
    }, [selectedFormula]);


    if (loading) return <Spinner/>;


    return (
        <>
            {selectedFormula && (
                <div style={{
                    padding: "12px 12px 5px 12px",
                    borderRadius: 6,
                    marginTop: 5,
                    marginBottom: 25
                }}>
                    <div style={{
                        display: "inline-block",
                        fontWeight: 600,
                        marginBottom: 8,
                        padding: "6px 10px",
                        background: "#3a3a3a",
                        border: "1px solid #d6e4ff",
                        borderRadius: 6,
                        color: "#e2fc2a",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}>
                        {selectedFormula.formula.name}
                    </div>

                    <Table
                        rowKey={(_, index) => index}
                        dataSource={specPathTableData}
                        pagination={false}
                        size="small"
                        columns={specPathColumns}
                        onRow={(_, index) => ({
                            onMouseEnter: () => setHoveredRow(index),
                            onMouseLeave: () => setHoveredRow(null)
                        })}
                        rowClassName={(_, index) =>
                            index === hoveredRow ? "spec-row-hover-red" : "spec-row-gray"
                        }
                    />
                    <Button type="primary"
                            icon={<BorderInnerOutlined/>}
                            size="small"
                            style={{marginTop: 10}}
                            onClick={startCreateSpecPath}/>
                </div>
            )}

            <Table rowKey="id"
                   columns={composerColumns}
                   dataSource={composerTableData}
                   pagination={false}
                   size="small"
            />

            {!isComposerCreating && (
                <div style={{marginTop: 10}}>
                    <Button type="primary" icon={<PlusCircleOutlined/>} onClick={startCreateComposer}>
                        Создать новый composer
                    </Button>
                </div>)}
        </>
    );
};

export default Composer;
