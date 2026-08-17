import svgPaths from "./svg-afg1vsnqqn";
import imgRectangle from "./86df414468f2616189300afb79f5d1686cb02777.png";
import imgLine from "./041fc3c4a81af051d94c27db03a8199dc3cea86f.png";
import imgLine1 from "./c8f90ee36fb742f8107296d12728d9857c8265c4.png";
import imgLine2 from "./0b25cc92b5e8e4aeffdd6ffcdc2a835174d8c11c.png";

function Globe() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="globe">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g clipPath="url(#clip0_0_565)" id="globe">
          <path d={svgPaths.p3b306c80} id="Vector" stroke="white" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_565">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[18px]" data-name="icon-wrapper">
      <Globe />
    </div>
  );
}

function LogoBadge() {
  return (
    <div className="bg-[#3b82f6] content-stretch flex items-start p-[8px] relative rounded-[8px] shrink-0" data-name="logo-badge">
      <IconWrapper />
    </div>
  );
}

function LogoIconRow() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="logo-icon-row">
      <LogoBadge />
      <p className="[word-break:break-word] font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">ORRE-GTC</p>
    </div>
  );
}

function BrandWrapper() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="brand-wrapper">
      <LogoIconRow />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-[#3b82f6] text-[11px] w-[min-content]">ROAD NETWORK PIPELINE</p>
    </div>
  );
}

function LayoutDashboard() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="layout-dashboard">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="layout-dashboard">
          <g id="Vector">
            <path d={svgPaths.pff0fc00} stroke="#3B82F6" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p1d76d410} stroke="#3B82F6" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p2f091200} stroke="#3B82F6" strokeLinecap="round" strokeWidth="2" />
            <path d={svgPaths.p39897300} stroke="#3B82F6" strokeLinecap="round" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconWrapper1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <LayoutDashboard />
    </div>
  );
}

function SidebarLink() {
  return (
    <div className="bg-[#1a2536] content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper1 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] min-w-px not-italic relative text-[13px] text-black">Dashboard</p>
    </div>
  );
}

function Image() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="image">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="image">
          <path d={svgPaths.p201c8e80} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <Image />
    </div>
  );
}

function SidebarLink1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center pl-[24px] pr-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper2 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">1. Input Image</p>
    </div>
  );
}

function Layers() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="layers">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_546)" id="layers">
          <path d={svgPaths.p4fb03f0} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_546">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <Layers />
    </div>
  );
}

function SidebarLink2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center pl-[24px] pr-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper3 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">2. Segmentation Mask</p>
    </div>
  );
}

function Activity() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="activity">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_572)" id="activity">
          <path d={svgPaths.p2776b880} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_572">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <Activity />
    </div>
  );
}

function SidebarLink3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center pl-[24px] pr-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper4 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">3. Graph Construction</p>
    </div>
  );
}

function CheckSquare() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="check-square">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="check-square">
          <path d={svgPaths.p184fca80} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <CheckSquare />
    </div>
  );
}

function SidebarLink4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center pl-[24px] pr-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper5 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">4. Healed Topology</p>
    </div>
  );
}

function TrendingUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="trending-up">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="trending-up">
          <path d={svgPaths.p2d3ae2e0} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <TrendingUp />
    </div>
  );
}

function SidebarLink5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center pl-[24px] pr-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper6 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">5. Criticality Metrics</p>
    </div>
  );
}

function UploadCloud() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="upload-cloud">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="upload-cloud">
          <path d={svgPaths.p114aca00} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <UploadCloud />
    </div>
  );
}

function SidebarLink6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper7 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">Upload Data</p>
    </div>
  );
}

function Sliders() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="sliders">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="sliders">
          <path d={svgPaths.p3673b280} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <Sliders />
    </div>
  );
}

function SidebarLink7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper8 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">{`Model & Parameters`}</p>
    </div>
  );
}

function History() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="history">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="history">
          <path d={svgPaths.p49cdb00} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <History />
    </div>
  );
}

function SidebarLink8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper9 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">Past Runs</p>
    </div>
  );
}

function Info() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="info">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g clipPath="url(#clip0_0_540)" id="info">
          <path d={svgPaths.p1298de00} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_540">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper10() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <Info />
    </div>
  );
}

function SidebarLink9() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper10 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">About Project</p>
    </div>
  );
}

function FileText() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="file-text">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="file-text">
          <path d={svgPaths.p3cbc4600} id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper11() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <FileText />
    </div>
  );
}

function SidebarLink10() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="sidebar-link">
      <IconWrapper11 />
      <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-px not-italic relative text-[#94a3b8] text-[13px]">Documentation</p>
    </div>
  );
}

function NavigationList() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="navigation-list">
      <SidebarLink />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[10px] uppercase whitespace-nowrap">Pipeline Stages</p>
      <SidebarLink1 />
      <SidebarLink2 />
      <SidebarLink3 />
      <SidebarLink4 />
      <SidebarLink5 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[10px] uppercase whitespace-nowrap">System Settings</p>
      <SidebarLink6 />
      <SidebarLink7 />
      <SidebarLink8 />
      <SidebarLink9 />
      <SidebarLink10 />
    </div>
  );
}

function BottomSpacer() {
  return <div className="flex-[1_0_0] min-h-px relative w-full" data-name="bottom-spacer" />;
}

function StatusRow() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="status-row">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[11px] text-black whitespace-nowrap">ACTIVE CURRENT RUN</p>
      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="#10B981" id="Ellipse" r="4" />
        </svg>
      </div>
    </div>
  );
}

function MetaRow() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal gap-[4px] items-start leading-[normal] relative shrink-0 text-[#94a3b8] text-[10px] w-full whitespace-nowrap" data-name="meta-row">
      <p className="overflow-hidden relative shrink-0 text-ellipsis w-full">ID: RUN-2026_AUG13_V4</p>
      <p className="overflow-hidden relative shrink-0 text-ellipsis w-full">Checkpoint: model_healed.pt</p>
      <p className="overflow-hidden relative shrink-0 text-ellipsis w-full">13 Aug 2026, 10:02 PM</p>
    </div>
  );
}

function CurrentRunBox() {
  return (
    <div className="bg-[#1a2536] content-stretch flex flex-col gap-[8px] items-start p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="current-run-box">
      <StatusRow />
      <MetaRow />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-[#0e1624] content-stretch flex flex-col gap-[20px] items-start px-[16px] py-[24px] relative self-stretch shrink-0 w-[260px]" data-name="sidebar">
      <BrandWrapper />
      <NavigationList />
      <BottomSpacer />
      <CurrentRunBox />
    </div>
  );
}

function HeaderTitle() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-[750px]" data-name="header-title">
      <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold relative shrink-0 text-[#0f172a] text-[22px] w-full">{`Occlusion-Robust Road Extraction & Graph-Theoretic Criticality Pipeline`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#475569] text-[13px] w-full">An AI-assisted civil infrastructure evaluation engine for remote sensing road segmentation and path resilience analysis.</p>
    </div>
  );
}

function UploadCloud1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="upload-cloud">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="upload-cloud">
          <path d={svgPaths.p114aca00} id="Vector" stroke="#3B82F6" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper12() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <UploadCloud1 />
    </div>
  );
}

function UploadDataBtn() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-name="upload-data-btn">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <IconWrapper12 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Upload New Data</p>
    </div>
  );
}

function TopHeader() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="top-header">
      <HeaderTitle />
      <UploadDataBtn />
    </div>
  );
}

function Activity1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="activity">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_514)" id="activity">
          <path d={svgPaths.p3a5b4500} id="Vector" stroke="#3B82F6" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_514">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper13() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <Activity1 />
    </div>
  );
}

function IconBg() {
  return (
    <div className="bg-[#e0f2fe] content-stretch flex flex-col items-start p-[6px] relative rounded-[6px] shrink-0" data-name="icon-bg">
      <IconWrapper13 />
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#475569] text-[11px] text-ellipsis uppercase w-[110px] whitespace-nowrap">Connectivity Ratio</p>
      <IconBg />
    </div>
  );
}

function MetricCard() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <HeaderRow />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[22px] w-full">96.4%</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[11px] text-ellipsis w-full whitespace-nowrap">↑ +12.7% vs Raw (Healed)</p>
    </div>
  );
}

function CheckSquare1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="check-square">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_542)" id="check-square">
          <path d={svgPaths.p2f715d00} id="Vector" stroke="#10B981" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_542">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper14() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <CheckSquare1 />
    </div>
  );
}

function IconBg1() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex flex-col items-start p-[6px] relative rounded-[6px] shrink-0" data-name="icon-bg">
      <IconWrapper14 />
    </div>
  );
}

function HeaderRow1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#475569] text-[11px] text-ellipsis uppercase w-[110px] whitespace-nowrap">Total Nodes</p>
      <IconBg1 />
    </div>
  );
}

function MetricCard1() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <HeaderRow1 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[22px] w-full">8,432</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[11px] text-ellipsis w-full whitespace-nowrap">Extracted road junctions</p>
    </div>
  );
}

function Layers1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="layers">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_563)" id="layers">
          <path d={svgPaths.p25b8ae80} id="Vector" stroke="#8B5CF6" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_563">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper15() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <Layers1 />
    </div>
  );
}

function IconBg2() {
  return (
    <div className="bg-[#f3e8ff] content-stretch flex flex-col items-start p-[6px] relative rounded-[6px] shrink-0" data-name="icon-bg">
      <IconWrapper15 />
    </div>
  );
}

function HeaderRow2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#475569] text-[11px] text-ellipsis uppercase w-[110px] whitespace-nowrap">Total Edges</p>
      <IconBg2 />
    </div>
  );
}

function MetricCard2() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <HeaderRow2 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[22px] w-full">12,987</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[11px] text-ellipsis w-full whitespace-nowrap">Inferred road segments</p>
    </div>
  );
}

function TrendingUp1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="trending-up">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="trending-up">
          <path d={svgPaths.p3baed800} id="Vector" stroke="#F59E0B" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper16() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <TrendingUp1 />
    </div>
  );
}

function IconBg3() {
  return (
    <div className="bg-[#ffedd5] content-stretch flex flex-col items-start p-[6px] relative rounded-[6px] shrink-0" data-name="icon-bg">
      <IconWrapper16 />
    </div>
  );
}

function HeaderRow3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#475569] text-[11px] text-ellipsis uppercase w-[110px] whitespace-nowrap">Global Efficiency</p>
      <IconBg3 />
    </div>
  );
}

function MetricCard3() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <HeaderRow3 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[22px] w-full">0.142</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[11px] text-ellipsis w-full whitespace-nowrap">Node-to-node path efficacy</p>
    </div>
  );
}

function Shield() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="shield">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="shield">
          <path d={svgPaths.pd0ea680} id="Vector" stroke="#EF4444" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper17() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <Shield />
    </div>
  );
}

function IconBg4() {
  return (
    <div className="bg-[#fee2e2] content-stretch flex flex-col items-start p-[6px] relative rounded-[6px] shrink-0" data-name="icon-bg">
      <IconWrapper17 />
    </div>
  );
}

function HeaderRow4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#475569] text-[11px] text-ellipsis uppercase w-[110px] whitespace-nowrap">Resilience Index</p>
      <IconBg4 />
    </div>
  );
}

function MetricCard4() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <HeaderRow4 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[22px] w-full">0.287</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[11px] text-ellipsis w-full whitespace-nowrap">Area Under GCC Curve</p>
    </div>
  );
}

function Globe1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="globe">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_557)" id="globe">
          <path d={svgPaths.p33a0abc0} id="Vector" stroke="#0D9488" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_557">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper18() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <Globe1 />
    </div>
  );
}

function IconBg5() {
  return (
    <div className="bg-[#ccfbf1] content-stretch flex flex-col items-start p-[6px] relative rounded-[6px] shrink-0" data-name="icon-bg">
      <IconWrapper18 />
    </div>
  );
}

function HeaderRow5() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#475569] text-[11px] text-ellipsis uppercase w-[110px] whitespace-nowrap">Gatekeeper Centrality</p>
      <IconBg5 />
    </div>
  );
}

function MetricCard5() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[8px] items-start min-w-px p-[16px] relative rounded-[8px]" data-name="metric-card">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <HeaderRow5 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[22px] w-full">0.0841</p>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic overflow-hidden relative shrink-0 text-[#94a3b8] text-[11px] text-ellipsis w-full whitespace-nowrap">Max Betweenness Centrality</p>
    </div>
  );
}

function KpiRow() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="kpi-row">
      <MetricCard />
      <MetricCard1 />
      <MetricCard2 />
      <MetricCard3 />
      <MetricCard4 />
      <MetricCard5 />
    </div>
  );
}

function TitleWrapper() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-name="title-wrapper">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[12px] w-full">1. Input Satellite</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal overflow-hidden relative shrink-0 text-[#94a3b8] text-[10px] text-ellipsis w-full whitespace-nowrap">Occluded aerial view</p>
    </div>
  );
}

function PreviewCanvas() {
  return (
    <div className="bg-[#1a2536] content-stretch flex flex-col h-[100px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-full" data-name="preview-canvas">
      <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle} />
      </div>
    </div>
  );
}

function PipelinePanel() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_26px] flex-col gap-[8px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="pipeline-panel">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <TitleWrapper />
      <PreviewCanvas />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#475569] text-[10px] text-ellipsis w-full whitespace-nowrap">Resolution: 0.5m/px</p>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper19() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <ChevronRight />
    </div>
  );
}

function TitleWrapper1() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-name="title-wrapper">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[12px] w-full">2. Segmentation Mask</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal overflow-hidden relative shrink-0 text-[#94a3b8] text-[10px] text-ellipsis w-full whitespace-nowrap">AI extraction output</p>
    </div>
  );
}

function MaskRender() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px p-[8px] relative w-full" data-name="mask-render">
      <div className="absolute flex h-[29.746px] items-center justify-center left-[8.96px] top-[20px] w-[97.628px]">
        <div className="flex-none rotate-15">
          <div className="bg-[#10b981] h-[4px] relative w-[100px]" data-name="Rectangle" />
        </div>
      </div>
      <div className="absolute flex h-[24.777px] items-center justify-center left-[20px] top-[19.16px] w-[118.872px]">
        <div className="-rotate-10 flex-none">
          <div className="bg-[#10b981] h-[4px] relative w-[120px]" data-name="Rectangle" />
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[37.17px] size-[59.397px] top-[70px]">
        <div className="flex-none rotate-45">
          <div className="bg-[#10b981] h-[4px] relative w-[80px]" data-name="Rectangle" />
        </div>
      </div>
      <div className="absolute flex h-[16.187px] items-center justify-center left-[9.65px] top-[80px] w-[139.816px]">
        <div className="flex-none rotate-5">
          <div className="bg-[#10b981] h-[4px] relative w-[140px]" data-name="Rectangle" />
        </div>
      </div>
    </div>
  );
}

function PreviewCanvas1() {
  return (
    <div className="bg-[#0d1117] content-stretch flex flex-col h-[100px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-full" data-name="preview-canvas">
      <MaskRender />
    </div>
  );
}

function PipelinePanel1() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_26px] flex-col gap-[8px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="pipeline-panel">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <TitleWrapper1 />
      <PreviewCanvas1 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#475569] text-[10px] text-ellipsis w-full whitespace-nowrap">F1-Score: 0.892</p>
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper20() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <ChevronRight1 />
    </div>
  );
}

function TitleWrapper2() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-name="title-wrapper">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[12px] w-full">3. Raw Topology Graph</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal overflow-hidden relative shrink-0 text-[#94a3b8] text-[10px] text-ellipsis w-full whitespace-nowrap">Initial node linkage</p>
    </div>
  );
}

function GraphRender() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="graph-render">
      <div className="absolute flex h-[45.886px] items-center justify-center left-[10px] top-[20px] w-[65.532px]">
        <div className="flex-none rotate-35">
          <div className="h-0 relative w-[80px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
                <line id="Line" stroke="#475569" x2="80" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.941px] items-center justify-center left-[80px] top-[52.06px] w-[48.296px]">
        <div className="-rotate-15 flex-none">
          <div className="h-0 relative w-[50px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 50 1" width="50">
                <line id="Line" stroke="#475569" x2="50" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[15.628px] items-center justify-center left-[30px] top-[80px] w-[88.633px]">
        <div className="flex-none rotate-10">
          <div className="h-0 relative w-[90px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 90 1" width="90">
                <line id="Line" stroke="#475569" x2="90" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[10px] size-[5px] top-[20px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#EF4444" id="Ellipse" r="2.5" />
        </svg>
      </div>
      <div className="absolute left-[80px] size-[5px] top-[65px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#EF4444" id="Ellipse" r="2.5" />
        </svg>
      </div>
      <div className="absolute left-[30px] size-[5px] top-[80px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#EF4444" id="Ellipse" r="2.5" />
        </svg>
      </div>
      <div className="absolute left-[120px] size-[5px] top-[90px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#EF4444" id="Ellipse" r="2.5" />
        </svg>
      </div>
    </div>
  );
}

function PreviewCanvas2() {
  return (
    <div className="bg-[#0d1117] content-stretch flex flex-col h-[100px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-full" data-name="preview-canvas">
      <GraphRender />
    </div>
  );
}

function PipelinePanel2() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_26px] flex-col gap-[8px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="pipeline-panel">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <TitleWrapper2 />
      <PreviewCanvas2 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#475569] text-[10px] text-ellipsis w-full whitespace-nowrap">Connectivity: 73.7%</p>
    </div>
  );
}

function ChevronRight2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper21() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <ChevronRight2 />
    </div>
  );
}

function TitleWrapper3() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-name="title-wrapper">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[12px] w-full">4. Healed Graph</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal overflow-hidden relative shrink-0 text-[#94a3b8] text-[10px] text-ellipsis w-full whitespace-nowrap">Occlusion gap closure</p>
    </div>
  );
}

function HealedRender() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="healed-render">
      <div className="absolute flex h-[45.886px] items-center justify-center left-[10px] top-[20px] w-[65.532px]">
        <div className="flex-none rotate-35">
          <div className="h-0 relative w-[80px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
                <line id="Line" stroke="#475569" x2="80" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.941px] items-center justify-center left-[80px] top-[52.06px] w-[48.296px]">
        <div className="-rotate-15 flex-none">
          <div className="h-0 relative w-[50px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 50 2" width="50">
                <line id="Line" stroke="#10B981" strokeWidth="2" x2="50" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[15.628px] items-center justify-center left-[30px] top-[80px] w-[88.633px]">
        <div className="flex-none rotate-10">
          <div className="h-0 relative w-[90px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 90 1" width="90">
                <line id="Line" stroke="#475569" x2="90" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[10px] size-[5px] top-[20px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#10B981" id="Ellipse" r="2.5" />
        </svg>
      </div>
      <div className="absolute left-[80px] size-[5px] top-[65px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#10B981" id="Ellipse" r="2.5" />
        </svg>
      </div>
      <div className="absolute left-[30px] size-[5px] top-[80px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#10B981" id="Ellipse" r="2.5" />
        </svg>
      </div>
    </div>
  );
}

function PreviewCanvas3() {
  return (
    <div className="bg-[#0d1117] content-stretch flex flex-col h-[100px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-full" data-name="preview-canvas">
      <HealedRender />
    </div>
  );
}

function PipelinePanel3() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_26px] flex-col gap-[8px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="pipeline-panel">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <TitleWrapper3 />
      <PreviewCanvas3 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#475569] text-[10px] text-ellipsis w-full whitespace-nowrap">Connectivity: 96.4%</p>
    </div>
  );
}

function ChevronRight3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-right">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="#94A3B8" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper22() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="icon-wrapper">
      <ChevronRight3 />
    </div>
  );
}

function TitleWrapper4() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-name="title-wrapper">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[12px] w-full">5. Gatekeeper Centrality</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal overflow-hidden relative shrink-0 text-[#94a3b8] text-[10px] text-ellipsis w-full whitespace-nowrap">Criticality mapping</p>
    </div>
  );
}

function GateRender() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="gate-render">
      <div className="absolute flex h-[45.886px] items-center justify-center left-[10px] top-[20px] w-[65.532px]">
        <div className="flex-none rotate-35">
          <div className="h-0 relative w-[80px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 80 1" width="80">
                <line id="Line" stroke="#475569" x2="80" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[12.941px] items-center justify-center left-[80px] top-[52.06px] w-[48.296px]">
        <div className="-rotate-15 flex-none">
          <div className="h-0 relative w-[50px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 50 1" width="50">
                <line id="Line" stroke="#475569" x2="50" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[74px] size-[12px] top-[59px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
          <circle cx="6" cy="6" fill="#EF4444" fillOpacity="0.2" id="Ellipse" r="5" stroke="#EF4444" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute left-[10px] size-[5px] top-[20px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#EF4444" id="Ellipse" r="2.5" />
        </svg>
      </div>
      <div className="absolute left-[80px] size-[5px] top-[65px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="5" preserveAspectRatio="none" viewBox="0 0 5 5" width="5">
          <circle cx="2.5" cy="2.5" fill="#EF4444" id="Ellipse" r="2.5" />
        </svg>
      </div>
    </div>
  );
}

function PreviewCanvas4() {
  return (
    <div className="bg-[#0d1117] content-stretch flex flex-col h-[100px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-full" data-name="preview-canvas">
      <GateRender />
    </div>
  );
}

function PipelinePanel4() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_26px] flex-col gap-[8px] items-start min-w-px p-[12px] relative rounded-[8px]" data-name="pipeline-panel">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <TitleWrapper4 />
      <PreviewCanvas4 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#475569] text-[10px] text-ellipsis w-full whitespace-nowrap">Top 1% nodes highlighted</p>
    </div>
  );
}

function PipelineCardsRow() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="pipeline-cards-row">
      <PipelinePanel />
      <IconWrapper19 />
      <PipelinePanel1 />
      <IconWrapper20 />
      <PipelinePanel2 />
      <IconWrapper21 />
      <PipelinePanel3 />
      <IconWrapper22 />
      <PipelinePanel4 />
    </div>
  );
}

function BarTrack() {
  return (
    <div className="bg-[#e2e8f0] content-stretch flex h-[10px] items-start overflow-clip relative rounded-[5px] shrink-0 w-[160px]" data-name="bar-track">
      <div className="bg-[#3b82f6] h-full relative shrink-0 w-[139px]" data-name="Rectangle" />
    </div>
  );
}

function MeanConfidenceBar() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="mean-confidence-bar">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap">Mean Segmentation Confidence:</p>
      <BarTrack />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] whitespace-nowrap">0.87</p>
    </div>
  );
}

function ConnectorImprovementPill() {
  return (
    <div className="bg-[#dcfce7] content-stretch flex gap-[6px] items-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="connector-improvement-pill">
      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 6 6" width="6">
          <circle cx="3" cy="3" fill="#10B981" id="Ellipse" r="3" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#166534] text-[11px] whitespace-nowrap">Topological Healing resolved 184 fractured road segments</p>
    </div>
  );
}

function PipelineSubbar() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between p-[12px] relative rounded-[6px] shrink-0 w-full" data-name="pipeline-subbar">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <MeanConfidenceBar />
      <ConnectorImprovementPill />
    </div>
  );
}

function PipelineSection() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="pipeline-section">
      <PipelineCardsRow />
      <PipelineSubbar />
    </div>
  );
}

function ChartHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-name="chart-header">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[14px] w-full">Global Resilience (Dynamic Node Ablation)</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#475569] text-[11px] w-full">Topological destruction analysis under random vs targeted removal.</p>
    </div>
  );
}

function ChartPlotFrame() {
  return (
    <div className="h-[160px] relative shrink-0 w-full" data-name="chart-plot-frame">
      <div className="absolute h-0 left-0 top-[10px] w-[310px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 310 1" width="310">
            <line id="Line" stroke="#E2E8F0" x2="310" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-0 top-[45px] w-[310px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 310 1" width="310">
            <line id="Line" stroke="#E2E8F0" x2="310" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-0 top-[80px] w-[310px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 310 1" width="310">
            <line id="Line" stroke="#E2E8F0" x2="310" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-0 top-[115px] w-[310px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 310 1" width="310">
            <line id="Line" stroke="#E2E8F0" x2="310" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-0 top-[140px] w-[310px]" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 310 1" width="310">
            <line id="Line" stroke="#E2E8F0" x2="310" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute flex h-[140px] items-center justify-center left-[180px] top-[10px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[140px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" height="1" src={imgLine} width="140" />
            </div>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[186px] not-italic text-[#ef4444] text-[9px] top-[15px] whitespace-nowrap">Critical Threshold (0.58)</p>
      <div className="absolute flex h-[4.931px] items-center justify-center left-0 top-[10px] w-[29.592px]">
        <div className="flex-none rotate-[9.46deg]">
          <div className="h-0 relative w-[30px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 30 2" width="30">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="30" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[7.042px] items-center justify-center left-[30px] top-[15px] w-[30.19px]">
        <div className="flex-none rotate-[13.13deg]">
          <div className="h-0 relative w-[31px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 31 2" width="31">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="31" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.122px] items-center justify-center left-[60px] top-[22px] w-[30.279px]">
        <div className="flex-none rotate-[23.43deg]">
          <div className="h-0 relative w-[33px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 33 2" width="33">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="33" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[13.122px] items-center justify-center left-[90px] top-[35px] w-[30.279px]">
        <div className="flex-none rotate-[23.43deg]">
          <div className="h-0 relative w-[33px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 33 2" width="33">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="33" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[16.763px] items-center justify-center left-[120px] top-[48px] w-[29.58px]">
        <div className="flex-none rotate-[29.54deg]">
          <div className="h-0 relative w-[34px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 34 2" width="34">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="34" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[19.969px] items-center justify-center left-[150px] top-[65px] w-[29.954px]">
        <div className="flex-none rotate-[33.69deg]">
          <div className="h-0 relative w-[36px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 36 2" width="36">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="36" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[19.969px] items-center justify-center left-[180px] top-[85px] w-[29.954px]">
        <div className="flex-none rotate-[33.69deg]">
          <div className="h-0 relative w-[36px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 36 2" width="36">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="36" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[15.208px] items-center justify-center left-[210px] top-[105px] w-[30.409px]">
        <div className="flex-none rotate-[26.57deg]">
          <div className="h-0 relative w-[34px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 34 2" width="34">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="34" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[15.208px] items-center justify-center left-[240px] top-[120px] w-[30.409px]">
        <div className="flex-none rotate-[26.57deg]">
          <div className="h-0 relative w-[34px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 34 2" width="34">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="34" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[4.965px] items-center justify-center left-[270px] top-[135px] w-[39.691px]">
        <div className="flex-none rotate-[7.13deg]">
          <div className="h-0 relative w-[40px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 40 2" width="40">
                <line id="Line" stroke="#3B82F6" strokeWidth="2" x2="40" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[19.969px] items-center justify-center left-0 top-[15px] w-[29.954px]">
        <div className="flex-none rotate-[33.69deg]">
          <div className="h-0 relative w-[36px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 36 2" width="36">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="36" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[19.969px] items-center justify-center left-[30px] top-[35px] w-[29.954px]">
        <div className="flex-none rotate-[33.69deg]">
          <div className="h-0 relative w-[36px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 36 2" width="36">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="36" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[24.97px] items-center justify-center left-[60px] top-[55px] w-[29.959px]">
        <div className="flex-none rotate-[39.81deg]">
          <div className="h-0 relative w-[39px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 39 2" width="39">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="39" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[24.97px] items-center justify-center left-[90px] top-[80px] w-[29.959px]">
        <div className="flex-none rotate-[39.81deg]">
          <div className="h-0 relative w-[39px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 39 2" width="39">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="39" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[15.208px] items-center justify-center left-[120px] top-[105px] w-[30.409px]">
        <div className="flex-none rotate-[26.57deg]">
          <div className="h-0 relative w-[34px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 34 2" width="34">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="34" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[10.117px] items-center justify-center left-[150px] top-[120px] w-[30.359px]">
        <div className="flex-none rotate-[18.43deg]">
          <div className="h-0 relative w-[32px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 32 2" width="32">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="32" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[4.931px] items-center justify-center left-[180px] top-[130px] w-[29.592px]">
        <div className="flex-none rotate-[9.46deg]">
          <div className="h-0 relative w-[30px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 30 2" width="30">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="30" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[2.985px] items-center justify-center left-[210px] top-[135px] w-[29.851px]">
        <div className="flex-none rotate-[5.71deg]">
          <div className="h-0 relative w-[30px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 30 2" width="30">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="30" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[1.993px] items-center justify-center left-[240px] top-[138px] w-[29.934px]">
        <div className="flex-none rotate-[3.81deg]">
          <div className="h-0 relative w-[30px]" data-name="Line">
            <div className="absolute inset-[-2px_0_0_0]">
              <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 30 2" width="30">
                <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="30" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-0 left-[270px] top-[140px] w-[40px]" data-name="Line">
        <div className="absolute inset-[-2px_0_0_0]">
          <svg className="block size-full" fill="none" height="2" preserveAspectRatio="none" viewBox="0 0 40 2" width="40">
            <line id="Line" stroke="#F59E0B" strokeWidth="2" x2="40" y1="1" y2="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LegendItem() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="legend-item-1">
      <div className="bg-[#3b82f6] h-[3px] relative shrink-0 w-[12px]" data-name="Rectangle" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap">GCC Fraction</p>
    </div>
  );
}

function LegendItem1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="legend-item-2">
      <div className="bg-[#f59e0b] h-[3px] relative shrink-0 w-[12px]" data-name="Rectangle" />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap">Global Efficiency</p>
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="chart-legend">
      <LegendItem />
      <LegendItem1 />
    </div>
  );
}

function PanelText() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[180px]" data-name="panel-text">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[12px]">Resilience Index</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#94a3b8] text-[10px]">Area Under GCC Curve</p>
    </div>
  );
}

function ResilienceScorePanel() {
  return (
    <div className="[word-break:break-word] bg-[#f8fafc] content-stretch flex items-center justify-between leading-[normal] not-italic p-[12px] relative rounded-[6px] shrink-0 w-full whitespace-nowrap" data-name="resilience-score-panel">
      <PanelText />
      <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold relative shrink-0 text-[#ef4444] text-[20px]">0.287 / 0.50</p>
    </div>
  );
}

function ResilienceColumn() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[10px]" data-name="resilience-column">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <ChartHeader />
      <ChartPlotFrame />
      <ChartLegend />
      <ResilienceScorePanel />
    </div>
  );
}

function TableHeading() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-[200px]" data-name="table-heading">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[14px] w-full">Top Gatekeeper Nodes</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#475569] text-[11px] w-full">Identified via Betweenness Centrality</p>
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="search">
      <svg className="absolute block inset-0 size-full" fill="none" height="10" preserveAspectRatio="none" viewBox="0 0 10 10" width="10">
        <g clipPath="url(#clip0_0_497)" id="search">
          <path d={svgPaths.p3f94d980} id="Vector" stroke="#475569" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_497">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper23() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[10px]" data-name="icon-wrapper">
      <Search />
    </div>
  );
}

function TableSearch() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="table-search">
      <IconWrapper23 />
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap">Filter Node...</p>
    </div>
  );
}

function TableTitleRow() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="table-title-row">
      <TableHeading />
      <TableSearch />
    </div>
  );
}

function ThRow() {
  return (
    <div className="[word-break:break-word] bg-[#f8fafc] content-stretch flex font-['Inter:Bold',sans-serif] font-bold gap-[16px] items-start leading-[normal] not-italic px-[12px] py-[6px] relative rounded-[4px] shrink-0 text-[#475569] text-[11px] w-full" data-name="th-row">
      <p className="relative shrink-0 w-[40px]">Rank</p>
      <p className="relative shrink-0 w-[80px]">Node ID</p>
      <p className="flex-[1_0_0] min-w-px relative">Betweenness Centrality</p>
      <p className="relative shrink-0 text-right w-[50px]">Degree</p>
    </div>
  );
}

function BarTrack1() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[101px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0841</p>
      <BarTrack1 />
    </div>
  );
}

function GatekeeperRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#1</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_5123</p>
      <CentralityBarCol />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">6</p>
    </div>
  );
}

function BarTrack2() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[92px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0765</p>
      <BarTrack2 />
    </div>
  );
}

function GatekeeperRow1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#2</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_2091</p>
      <CentralityBarCol1 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">5</p>
    </div>
  );
}

function BarTrack3() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[85px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0712</p>
      <BarTrack3 />
    </div>
  );
}

function GatekeeperRow2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#3</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_0456</p>
      <CentralityBarCol2 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">5</p>
    </div>
  );
}

function BarTrack4() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[77px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0638</p>
      <BarTrack4 />
    </div>
  );
}

function GatekeeperRow3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#4</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_8811</p>
      <CentralityBarCol3 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">4</p>
    </div>
  );
}

function BarTrack5() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[71px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0592</p>
      <BarTrack5 />
    </div>
  );
}

function GatekeeperRow4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#5</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_1423</p>
      <CentralityBarCol4 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">4</p>
    </div>
  );
}

function BarTrack6() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[65px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0541</p>
      <BarTrack6 />
    </div>
  );
}

function GatekeeperRow5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#6</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_0312</p>
      <CentralityBarCol5 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">3</p>
    </div>
  );
}

function BarTrack7() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[59px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0489</p>
      <BarTrack7 />
    </div>
  );
}

function GatekeeperRow6() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#7</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_6509</p>
      <CentralityBarCol6 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">3</p>
    </div>
  );
}

function BarTrack8() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[4px] shrink-0 w-[120px]" data-name="bar-track">
      <div className="bg-[#f59e0b] h-full relative rounded-[4px] shrink-0 w-[49px]" data-name="Rectangle" />
    </div>
  );
}

function CentralityBarCol7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="centrality-bar-col">
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] w-[60px]">0.0411</p>
      <BarTrack8 />
    </div>
  );
}

function GatekeeperRow7() {
  return (
    <div className="content-stretch flex gap-[16px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="gatekeeper-row">
      <div aria-hidden className="absolute border-[#e2e8f0] border-b border-solid inset-0 pointer-events-none" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[12px] w-[40px]">#8</p>
      <p className="[word-break:break-word] font-['JetBrains_Mono:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3b82f6] text-[12px] w-[80px]">Node_1163</p>
      <CentralityBarCol7 />
      <p className="[word-break:break-word] font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] text-right w-[50px]">3</p>
    </div>
  );
}

function TableBodyRows() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="table-body-rows">
      <GatekeeperRow />
      <GatekeeperRow1 />
      <GatekeeperRow2 />
      <GatekeeperRow3 />
      <GatekeeperRow4 />
      <GatekeeperRow5 />
      <GatekeeperRow6 />
      <GatekeeperRow7 />
    </div>
  );
}

function GatekeeperTableColumn() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[10px]" data-name="gatekeeper-table-column">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <TableTitleRow />
      <ThRow />
      <TableBodyRows />
    </div>
  );
}

function WhatIfTitle() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic relative shrink-0 w-full" data-name="what-if-title">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[14px] w-full">What-If Analysis (Single Node Removal)</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#475569] text-[11px] w-full">Simulate targeted node destruction to observe criticality degradation.</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="chevron-down">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="#475569" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper24() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <ChevronDown />
    </div>
  );
}

function SelectDropdown() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_26px] items-center justify-between min-w-px px-[12px] py-[8px] relative rounded-[6px]" data-name="select-dropdown">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Selected Node: Node_5123 (Max BC)</p>
      <IconWrapper24 />
    </div>
  );
}

function RunSimBtn() {
  return (
    <div className="bg-[#ef4444] content-stretch flex items-start px-[12px] py-[8px] relative rounded-[6px] shrink-0" data-name="run-sim-btn">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Ablate</p>
    </div>
  );
}

function SimulatorControls() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="simulator-controls">
      <SelectDropdown />
      <RunSimBtn />
    </div>
  );
}

function MiniGraph() {
  return (
    <div className="h-[60px] relative shrink-0 w-[110px]" data-name="mini-graph">
      <svg className="absolute block inset-0 size-full" fill="none" height="60" preserveAspectRatio="none" viewBox="0 0 110 60" width="110">
        <g id="mini-graph">
          <line id="Line" stroke="#94A3B8" x1="10.171" x2="57.1556" y1="29.5302" y2="46.6312" />
          <line id="Line_2" stroke="#94A3B8" x1="59.6464" x2="87.9307" y1="44.6464" y2="16.3622" />
          <circle cx="60" cy="45" fill="#EF4444" id="Ellipse" r="3.5" stroke="white" />
          <g id="Ellipse_2" />
          <g id="Ellipse_3" />
          <g id="Ellipse_4" />
        </g>
      </svg>
    </div>
  );
}

function BeforeCanvas() {
  return (
    <div className="bg-[#111827] content-stretch flex flex-col h-[80px] items-center justify-center relative rounded-[6px] shrink-0 w-full" data-name="before-canvas">
      <MiniGraph />
    </div>
  );
}

function BeforeSim() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="before-sim">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap">Before Removal</p>
      <BeforeCanvas />
    </div>
  );
}

function MiniGraph1() {
  return (
    <div className="h-[60px] relative shrink-0 w-[110px]" data-name="mini-graph">
      <div className="absolute flex h-[13.681px] items-center justify-center left-[10px] top-[30px] w-[37.588px]">
        <div className="flex-none rotate-20">
          <div className="h-0 relative w-[40px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" height="1" src={imgLine1} width="40" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[60px] size-[21.213px] top-[23.79px]">
        <div className="-rotate-45 flex-none">
          <div className="h-0 relative w-[30px]" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img alt="" className="block max-w-none size-full" height="1" src={imgLine2} width="30" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-[10px] size-[4px] top-[30px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
          <circle cx="2" cy="2" fill="#94A3B8" id="Ellipse" r="2" />
        </svg>
      </div>
      <div className="absolute left-[90px] size-[4px] top-[15px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="4" preserveAspectRatio="none" viewBox="0 0 4 4" width="4">
          <circle cx="2" cy="2" fill="#94A3B8" id="Ellipse" r="2" />
        </svg>
      </div>
    </div>
  );
}

function AfterCanvas() {
  return (
    <div className="bg-[#111827] content-stretch flex flex-col h-[80px] items-center justify-center relative rounded-[6px] shrink-0 w-full" data-name="after-canvas">
      <MiniGraph1 />
    </div>
  );
}

function AfterSim() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="after-sim">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#ef4444] text-[10px] whitespace-nowrap">After Removal</p>
      <AfterCanvas />
    </div>
  );
}

function VisualSimulationComparison() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full" data-name="visual-simulation-comparison">
      <BeforeSim />
      <AfterSim />
    </div>
  );
}

function ImpactRow() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="impact-row-1">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic relative shrink-0 text-[#475569]">GCC Fraction Change:</p>
      <p className="font-['JetBrains_Mono:Bold',sans-serif] font-bold relative shrink-0 text-[#ef4444]">- 14.2%</p>
    </div>
  );
}

function ImpactRow1() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="impact-row-2">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic relative shrink-0 text-[#475569]">Global Efficiency loss:</p>
      <p className="font-['JetBrains_Mono:Bold',sans-serif] font-bold relative shrink-0 text-[#ef4444]">- 21.6%</p>
    </div>
  );
}

function ImpactRow2() {
  return (
    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[11px] w-full whitespace-nowrap" data-name="impact-row-3">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic relative shrink-0 text-[#475569]">Isolated Sub-components:</p>
      <p className="font-['JetBrains_Mono:Bold',sans-serif] font-bold relative shrink-0 text-[#f59e0b]">+ 3 Components</p>
    </div>
  );
}

function ImpactMetricsBlock() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="impact-metrics-block">
      <ImpactRow />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 336 1" width="336">
            <line id="Line" stroke="#E2E8F0" x2="336" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <ImpactRow1 />
      <div className="h-0 relative shrink-0 w-full" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 336 1" width="336">
            <line id="Line" stroke="#E2E8F0" x2="336" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <ImpactRow2 />
    </div>
  );
}

function WhatIfColumn() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_34px] flex-col gap-[12px] items-start min-w-px p-[16px] relative rounded-[10px]" data-name="what-if-column">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <WhatIfTitle />
      <SimulatorControls />
      <VisualSimulationComparison />
      <ImpactMetricsBlock />
    </div>
  );
}

function BentoRow() {
  return (
    <div className="content-stretch flex gap-[14px] items-start relative shrink-0 w-full" data-name="bento-row">
      <ResilienceColumn />
      <GatekeeperTableColumn />
      <WhatIfColumn />
    </div>
  );
}

function SummaryStatement() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 w-[500px]" data-name="summary-statement">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[#0f172a] text-[12px] w-full">Pipeline Summary:</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#475569] text-[11px] w-full">The AI segmentation successfully generated clean binary masks. Post-processing healed road topological disconnects, improving overall network coherence to 96.4%. Gatekeeper modeling highlighted critical choke-points for emergency route planning.</p>
    </div>
  );
}

function LegendRaw() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="legend-raw">
      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 6 6" width="6">
          <circle cx="3" cy="3" fill="#EF4444" id="Ellipse" r="3" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap">Raw Node</p>
    </div>
  );
}

function LegendHealed() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="legend-healed">
      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 6 6" width="6">
          <circle cx="3" cy="3" fill="#10B981" id="Ellipse" r="3" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap">Healed Route</p>
    </div>
  );
}

function LegendGate() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="legend-gate">
      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
        <svg className="absolute block inset-0 size-full" fill="none" height="6" preserveAspectRatio="none" viewBox="0 0 6 6" width="6">
          <circle cx="3" cy="3" fill="#F59E0B" id="Ellipse" r="3" />
        </svg>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#475569] text-[10px] whitespace-nowrap">Gatekeeper</p>
    </div>
  );
}

function LegendBadgesRow() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full" data-name="legend-badges-row">
      <LegendRaw />
      <LegendHealed />
      <LegendGate />
    </div>
  );
}

function SummaryLegend() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[300px]" data-name="summary-legend">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[11px] w-full">Legend</p>
      <LegendBadgesRow />
    </div>
  );
}

function Download() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="download">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g clipPath="url(#clip0_0_489)" id="download">
          <path d={svgPaths.p2d3a35c0} id="Vector" stroke="#0F172A" strokeLinecap="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_0_489">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconWrapper25() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <Download />
    </div>
  );
}

function ExportGraphBtn() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex gap-[6px] items-center px-[14px] py-[10px] relative rounded-[6px] shrink-0" data-name="export-graph-btn">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <IconWrapper25 />
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Export Graph (GEXF)</p>
    </div>
  );
}

function FileText1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="file-text">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="file-text">
          <path d={svgPaths.p1b3c2900} id="Vector" stroke="white" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function IconWrapper26() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[14px]" data-name="icon-wrapper">
      <FileText1 />
    </div>
  );
}

function DownloadResultsBtn() {
  return (
    <div className="bg-[#3b82f6] content-stretch flex gap-[6px] items-center px-[14px] py-[10px] relative rounded-[6px] shrink-0" data-name="download-results-btn">
      <IconWrapper26 />
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Download Report</p>
    </div>
  );
}

function ExportButtonsGroup() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="export-buttons-group">
      <ExportGraphBtn />
      <DownloadResultsBtn />
    </div>
  );
}

function BottomSummaryBar() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="bottom-summary-bar">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <SummaryStatement />
      <SummaryLegend />
      <ExportButtonsGroup />
    </div>
  );
}

function Workspace() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px px-[24px] py-[20px] relative self-stretch" data-name="workspace">
      <TopHeader />
      <KpiRow />
      <PipelineSection />
      <BentoRow />
      <BottomSummaryBar />
    </div>
  );
}

export default function GisRoadNetworkDashboard() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start relative size-full" data-name="gis-road-network-dashboard">
      <Sidebar />
      <Workspace />
    </div>
  );
}