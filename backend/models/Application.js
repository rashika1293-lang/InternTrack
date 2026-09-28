import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: "Not specified", trim: true },
    appliedDate: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Applied"
    },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
