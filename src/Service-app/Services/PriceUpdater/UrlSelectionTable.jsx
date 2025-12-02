import {Input, Button, Checkbox, Popconfirm} from 'antd';
import {EditOutlined, SaveOutlined, DeleteOutlined, SyncOutlined} from '@ant-design/icons';
import TimeDateBlock from "../../../Ui/TimeDateBlock.jsx";
import styles from "../Css/urlselection.module.css";

export const UrlSelectionTableColumns = ({
                                             editingKey,
                                             editedValues,
                                             handleEdit,
                                             handleSave,
                                             handleAction,
                                             isSyncFeatures,
                                             showDeleteModal
                                         }) => [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (text, record) =>
            editingKey === record.id ? (
                <Input
                    value={editedValues.title || ''}
                    onChange={(e) =>
                        editedValues.set(prev => ({ ...prev, title: e.target.value }))
                    }
                />
            ) : (
                <a
                    className={styles.linkText}
                    onClick={() => {
                        handleAction({
                            key: "prevResults",
                            selectedRow: record
                        });
                    }}
                >
                    {text}
                </a>
            )
    },
    {
        key: "isSyncFeatures",
        align: "center",
        render: (_, record) => (
            <Checkbox
                className={styles.checkBoxSync}
                checked={isSyncFeatures[record.id] ?? false}
                onChange={(e) =>
                    handleAction({
                        key: "isSyncFeatures",
                        selectedRow: record,
                        value: e.target.checked
                    })
                }
            />
        ),
    },
    {
        key: "startParsing",
        align: "center",
        render: (_, record) => (
            <Popconfirm
                title="Вы уверены, что хотите обновить данные в этой таблице?"
                okText="Да"
                cancelText="Нет"
                onConfirm={() => {
                    handleAction({
                        key: "startParsing",
                        selectedRow: record,
                    });
                }}
            >
                <Button
                    icon={<SyncOutlined />}
                    className={styles.actionParsingBtn}
                />
            </Popconfirm>
        ),
    },
    {
        title: 'Собрано',
        dataIndex: 'dt_parsed',
        key: 'dt_parsed',
        align: 'center',
        render: (text) => <TimeDateBlock isoString={text}/>
    },
    {
        title: 'Действия',
        key: 'actions',
        width: 50,
        render: (_, record) => (
            <div className='search_table_action_buttons'>
                {editingKey === record.id ? (
                    <Button icon={<SaveOutlined/>} type="link" onClick={() => handleSave(record.id)}/>
                ) : (
                    <Button icon={<EditOutlined/>} type="link" onClick={() => handleEdit(record)}/>
                )}
                <Button icon={<DeleteOutlined/>} type="link" danger onClick={() => showDeleteModal(record)}/>
            </div>

        )
    },
    {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        align: 'left',
        onCell: () => ({style: {backgroundColor: '#ffffff'}}),
        render: (text, record) => editingKey === record.id ? (
            <Input
                value={editedValues.url || ''}
                onChange={(e) => editedValues.set(prev => ({...prev, url: e.target.value}))}/>) : (
            <a href={text} target="_blank" rel="noopener noreferrer"
               style={{color: '#3a3a3a', fontSize: '0.8em'}}> {text} </a>)
    }
];
