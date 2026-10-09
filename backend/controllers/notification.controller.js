import Notification from "../models/notification.model.js";


export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .populate("from", "userName profileImage");

     await Notification.updateMany({ to: userId, read: false }, { read: true });

     const notify= await Notification.find({to:userId}).
     sort({createdAt:-1}).populate("from","userName profileImage");
     
    return res.status(200).json(notify);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getNotification = async(req,res)=>{

//     try {
//         const userId = req.user._id;

//         const notification = await Notification.find({to:userId}).sort({createdAt:-1}).populate({
//             from :"from",
//             select:"userName profileImage"
//         });


//         await Notification.updateMany({to:userId},{read:true});

//         return res.status(200).json(notification);
//     } catch (error) {
//         return res.status(500).json({message:error.message});
//     }
// }
export const deleteNotification = async(req,res)=>{

    try {
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});

        return res.status(200).json({message:"Notification deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}