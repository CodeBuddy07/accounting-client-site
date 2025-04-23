


const TeamSwitcher = ({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) => {



  const activeTeam= teams[0];

  if (!activeTeam) {
    return null
  }


  return (
    <div className="flex gap-5 items-center justify-between px- py-2">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <activeTeam.logo className="size-5" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {activeTeam.name}
        </span>
        <span className="truncate text-xs">{activeTeam.plan}</span>
      </div>
    </div>
  );
};

export default TeamSwitcher;