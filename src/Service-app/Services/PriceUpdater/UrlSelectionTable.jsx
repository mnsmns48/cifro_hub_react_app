import {Input, Button} from 'antd';
import {EditOutlined, SaveOutlined, DeleteOutlined, ExportOutlined} from '@ant-design/icons';
import TimeDateBlock from "../../../Ui/TimeDateBlock.jsx";

export const UrlSelectionTableColumns = ({
                                             editingKey,
                                             editedValues,
                                             handleEdit,
                                             handleSave,
                                             handlePrevResByBtn,
                                             showDeleteModal
                                         }) => [
    {
        key: 'prev_results',
        align: 'center',
        render: (_, record) => (
            <div >
                <Button
                    style={{color: '#e2fc2a', background: '#3a3a3a', fontSize: '18px'}}
                    type="link"
                    icon={<ExportOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrevResByBtn(record);
                    }}
                />
            </div>
        )
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) =>
            editingKey === record.id ? (
                <Input
                    value={editedValues.title || ''}
                    onChange={(e) =>
                        editedValues.set(prev => ({...prev, title: e.target.value}))
                    }
                />
            ) : text
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
        width: 200,
        align: 'center',
        onCell: () => ({
            style: {backgroundColor: '#061e35'}
        }),
        render: (text, record) =>
            editingKey === record.id ? (
                <Input
                    value={editedValues.url || ''}
                    onChange={(e) =>
                        editedValues.set(prev => ({...prev, url: e.target.value}))
                    }
                />
            ) : (
                <a
                    href={text} target="_blank" rel="noopener noreferrer"
                    style={{fontSize: '10px', color: '#ffffff'}}>
                    {text}
                </a>
            )
    }
];
