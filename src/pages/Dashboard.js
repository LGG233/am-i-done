import ProfileForm from "../components/ProfileForm";

export default function Dashboard({ user }) {
    // You can optionally guard with `if (!user) return null;` if needed
    return (
        <div className="dashboard-page">
            <h1>About Me</h1>
            <ProfileForm user={user} />
        </div>
    );
}