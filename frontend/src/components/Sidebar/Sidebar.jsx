import SidebarDesktop from "./SidebarDesktop";
import SidebarTablet from "./SidebarTablet";
import SidebarMobile from "./SidebarMobile";

function Sidebar({
    open,
    setOpen,
}) {
    return (
        <>
            <SidebarDesktop />

            <SidebarTablet />

            <SidebarMobile
                open={open}
                setOpen={setOpen}
            />
        </>
    );
}

export default Sidebar;