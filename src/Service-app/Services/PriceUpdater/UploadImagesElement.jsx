import { Image } from "antd";
import { CloseCircleFilled, StarFilled, StarOutlined } from "@ant-design/icons";

const UploadedImageItem = ({ filename, url, isPreview, onDelete, onMakePreview  }) => (
    <div
        style={{
            position: "relative",
            width: 80,
            height: 80,
            overflow: "hidden",
            borderRadius: 4,
            border: isPreview ? "3px solid #1890ff" : "1px solid #ddd",
        }}
    >
        <Image
            src={url}
            alt={filename}
            width={80}
            height={80}
            style={{ objectFit: "cover" }}
        />
        {isPreview ? (
            <StarFilled
                style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    color: "#ebfa14",
                    fontSize: 18,
                }}
            />
        ) : (
            <StarOutlined
                onClick={() => onMakePreview(filename)}
                style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    color: "#fff",
                    fontSize: 18,
                    textShadow: "0 0 2px rgba(0,0,0,0.5)",
                    cursor: "pointer",
                }}
            />
        )}
        <CloseCircleFilled
            onClick={() => onDelete(filename)}
            style={{
                position: "absolute",
                top: 2,
                right: 2,
                fontSize: 16,
                color: "#ff4d4f",
                backgroundColor: "#fff",
                borderRadius: "50%",
                cursor: "pointer",
            }}
        />
    </div>
);

export default UploadedImageItem;
