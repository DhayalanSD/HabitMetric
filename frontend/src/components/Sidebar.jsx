import SidebarDesktop from "./Sidebar/SidebarDesktop";
import SidebarTablet from "./Sidebar/SidebarTablet";
import SidebarMobile from "./Sidebar/SidebarMobile";

function Sidebar({
    open,
    setOpen,
}) {
    return (
        <>
            <>
    {/* Desktop */}
    <div className="hidden lg:block">
        <SidebarDesktop />
    </div>

    {/* Tablet */}
    <div className="hidden md:block lg:hidden">
        <SidebarTablet />
    </div>

    {/* Mobile */}
    <div className="block md:hidden">
        <SidebarMobile
            open={open}
            setOpen={setOpen}
        />
    </div>
</>
        </>
    );
}

export default Sidebar;