import {Input, Button, Checkbox} from 'antd';
import {EditOutlined, SaveOutlined, DeleteOutlined, SearchOutlined, SyncOutlined} from '@ant-design/icons';
import TimeDateBlock from "../../../Ui/TimeDateBlock.jsx";
import styles from "../Css/urlselection.module.css";

export const UrlSelectionTableColumns = ({
                                             editingKey,
                                             editedValues,
                                             handleEdit,
                                             handleSave,
                                             handlePrevResByBtn,
                                             showDeleteModal
                                         }) => [
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
            ) : (
                <a style={{fontFamily: "'TT Firs Neue', sans-serif"}}
                   onClick={(e) => {
                       e.stopPropagation();
                       handlePrevResByBtn(record)
                   }}
                   className={styles.linkText}
                >
                    {text}
                </a>
            )
    },
    {
        key: "isSyncFeatures",
        align: "center",
        render: () => (
            <Checkbox
                // onChange={() => {
                //     // пока ничего не делаем
                // }}
            />
        ),
    },
    {
        key: "startParsingBtn",
        align: "center",
        render: () => (
            <Button icon={<SyncOutlined/>} className={styles.actionParsingBtn}/>
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
        onCell: () => ({
            style: {backgroundColor: '#e0e0e0'}
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
                    style={{color: '#3a3a3a', fontSize: '0.8em'}}>
                    {text}
                </a>
            )
    }
];
