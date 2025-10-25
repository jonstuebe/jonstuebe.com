import invitationhomesLogo from "@/assets/invitationhomes.svg";
import creonesourceLogo from "@/assets/onesource.webp";
import smartrentLogo from "@/assets/smartrent.svg";
import {
  SiGithub as GithubIcon,
  SiBluesky as BlueskyIcon,
} from "@icons-pack/react-simple-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { cn } from "./lib/utils";

function App() {
  return (
    <div className="flex flex-col h-[100svh] pt-2 md:pt-4 pl-2 md:pl-4 pr-2 md:pr-4">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg leading-1 md:text-2xl font-semibold tracking-tight text-foreground">
          jon
          <span className="text-accent-foreground/70">stuebe</span>
        </h3>
        <div className="flex flex-row gap-4 items-center">
          <a
            href="https://github.com/jonstuebe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="size-6 text-foreground/70 hover:text-foreground transition-colors duration-300" />
          </a>
          <a
            href="https://bsky.app/profile/stoobs.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BlueskyIcon className="size-6 text-foreground/70 hover:text-foreground transition-colors duration-300" />
          </a>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 w-full max-w-full md:max-w-2xl mx-auto">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-col gap-2 py-12">
            <h2 className="text-left text-2xl tracking-tighter text-foreground">
              Hello! I'm Jon.
            </h2>
            <h1 className="text-5xl leading-11 tracking-tighter font-bold text-foreground">
              I build intuitive apps <br />
              for the{" "}
              <span className="text-accent-foreground/70">web and mobile</span>
            </h1>
            <p>
              I'm currently working at{" "}
              <a
                href="https://creonesource.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-foreground/70 hover:text-accent-foreground"
              >
                CRE Onesource
              </a>{" "}
              as a Software Engineer.
            </p>
            <div
              className={cn(
                "flex flex-row gap-2 items-center",
                "[&_img]:size-8",
                "[&_.app]:size-14 [&_.app]:flex [&_.app]:flex-row [&_.app]:items-center [&_.app]:justify-center [&_.app]:cursor-pointer [&_.app]:rounded-full [&_.app]:bg-accent/80",
                "[&>.app]:hover:scale-105 [&>.app]:transition-all [&>.app]:duration-300",
                "[&>.app>_img]:hover:scale-105 [&>.app>_img]:transition-transform [&>.app>_img]:duration-300"
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://creonesource.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app"
                  >
                    <img src={creonesourceLogo} alt="CRE OneSource" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Currently building the core platform for CRE Onesource
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://smartrent.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app grayscale-100 hover:grayscale-0"
                  >
                    <img src={smartrentLogo} alt="SmartRent" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Built and shipped mobile and web apps for SmartRent
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://invitationhomes.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app grayscale-100 hover:grayscale-0"
                  >
                    <img src={invitationhomesLogo} alt="Invitation Homes" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Built custom internal and customer-facing software for
                  Invitation Homes
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
