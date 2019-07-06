import {message} from 'antd';

function getBase64(img, callback){
    const reader = new FileReader();
    reader.addEventListener('load',()=>{
      callback(reader.result);
    });
    reader.readAsDataURL(img);
  }
function beforeUpload(file){
    const isVailde = (file.type === 'image/png' || file.type === 'image/jpeg'); 
    if(!isVailde){
        message.error('你只能上传png、jpg图像哦。');
    }else{
        const isLargeThan2M = file.size / 1024 / 1024 > 2;
        if(isLargeThan2M){
        message.error('你上传的图片文件大小超过了2M的限制！')
        }
        return isVailde && !isLargeThan2M;
    }
}

export {getBase64, beforeUpload};