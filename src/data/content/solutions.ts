import type { DetailPageContent } from "@/types/detail-page";

export type SolutionDetail = DetailPageContent & {
  anchor: string;
  href: string;
  card: { title: string; text: string; icon: string };
};

export const solutionPages = {
  household: {
    anchor: "household",
    href: "/giai-phap/#household",
    title: "Giải pháp điện mặt trời cho hộ gia đình",
    image: "sol-household.png",
    card: {
      title: "Giải pháp hộ gia đình",
      text: "Cân đối theo hóa đơn điện, thói quen sử dụng và điều kiện mái nhà.",
      icon: "⌂",
    },
    lead: "Mỗi gia đình có mức sử dụng điện và điều kiện mái khác nhau. Phương án cần bắt đầu từ nhu cầu thực tế, không áp một cấu hình chung cho mọi ngôi nhà.",
    overviewTitle: "Phương án bắt đầu từ nhu cầu thực tế",
    overview: "Điểm khởi đầu là xem gia đình dùng điện vào thời điểm nào, mái nhà có điều kiện ra sao và hệ thống cần đáp ứng mục tiêu gì.",
    imageAlt: "Hình minh họa hệ thống điện mặt trời trên mái nhà",
    note: "Nội dung giới thiệu sơ bộ. Cấu hình, sản lượng, thiết bị, chi phí và tiến độ cần được xác định sau khi khảo sát công trình.",
    considerations: [
      { title: "Nhu cầu sử dụng", text: "Thời điểm gia đình dùng điện và hóa đơn gần đây giúp xác định phụ tải cần xem xét." },
      { title: "Điều kiện mái nhà", text: "Diện tích, hướng mái, vật liệu và hiện trạng kết cấu cần được kiểm tra trước khi thiết kế." },
      { title: "Mục tiêu đầu tư", text: "Nhu cầu tự sử dụng, dự phòng hoặc cân nhắc lưu trữ sẽ ảnh hưởng đến cấu hình được đề xuất." },
    ],
    steps: [
      { title: "Trao đổi nhu cầu", text: "Ghi nhận hóa đơn điện, khung giờ sử dụng và mong muốn của gia đình." },
      { title: "Khảo sát công trình", text: "Đánh giá mái nhà, vị trí lắp đặt và các điều kiện kỹ thuật liên quan." },
      { title: "Đề xuất phương án", text: "Thống nhất cấu hình, thiết bị và chi phí sau khi có đủ dữ liệu khảo sát." },
    ],
  },
  smallBusiness: {
    anchor: "small-business",
    href: "/giai-phap/#small-business",
    title: "Giải pháp điện mặt trời cho hộ kinh doanh vừa và nhỏ",
    image: "sol-business.png",
    card: {
      title: "Giải pháp hộ kinh doanh vừa & nhỏ",
      text: "Xem xét giờ vận hành, phụ tải ban ngày và diện tích mái trước khi đề xuất hệ thống.",
      icon: "⚙",
    },
    lead: "Với cửa hàng, xưởng nhỏ và cơ sở dịch vụ, thời gian hoạt động ảnh hưởng trực tiếp đến cách xem xét phương án điện mặt trời. Cần đối chiếu giờ vận hành với nhu cầu điện thực tế của cơ sở.",
    overviewTitle: "Đối chiếu giờ vận hành với nhu cầu điện",
    overview: "Việc đối chiếu giờ hoạt động với hồ sơ điện giúp xác định dữ liệu còn thiếu trước khi so sánh phương án cho cơ sở.",
    imageAlt: "Hình minh họa hệ thống điện mặt trời cho cơ sở kinh doanh",
    note: "Nội dung giới thiệu sơ bộ. Quy mô, cấu hình, thiết bị, chi phí và tiến độ cần được xác định sau khi khảo sát cơ sở.",
    considerations: [
      { title: "Khung giờ vận hành", text: "Ngày và ca hoạt động cho biết khi nào cơ sở sử dụng điện và cần đối chiếu với sản lượng dự kiến." },
      { title: "Phụ tải và hóa đơn", text: "Thiết bị đang dùng, công suất vận hành và lịch sử hóa đơn là đầu vào cho bước đánh giá." },
      { title: "Mặt bằng lắp đặt", text: "Diện tích mái, vật cản và hiện trạng công trình được khảo sát trước khi xác định quy mô." },
    ],
    steps: [
      { title: "Thu thập thông tin", text: "Tổng hợp hóa đơn, giờ hoạt động và các thiết bị tiêu thụ điện chính." },
      { title: "Khảo sát mặt bằng", text: "Kiểm tra mái, vị trí thiết bị và điều kiện thi công tại cơ sở." },
      { title: "So sánh phương án", text: "Đối chiếu phương án với nhu cầu vận hành và dữ liệu thực tế trước khi chốt thiết kế." },
    ],
  },
  enterprise: {
    anchor: "enterprise",
    href: "/giai-phap/#enterprise",
    title: "Giải pháp điện mặt trời cho doanh nghiệp và công nghiệp",
    image: "sol-enterprise.png",
    card: {
      title: "Giải pháp doanh nghiệp & công nghiệp",
      text: "Khảo sát phụ tải, mặt bằng, yêu cầu kỹ thuật và quy trình phối hợp của công trình.",
      icon: "▤",
    },
    lead: "Công trình doanh nghiệp cần được xem xét cùng phụ tải, lịch sản xuất, hạ tầng điện và yêu cầu vận hành. Phạm vi thiết kế và triển khai chỉ có thể xác định sau khi rà soát dữ liệu của từng địa điểm.",
    overviewTitle: "Phạm vi kỹ thuật theo từng công trình",
    overview: "Phân tích phụ tải, hiện trạng kết cấu và điều kiện đấu nối là cơ sở để xác định phạm vi kỹ thuật của dự án.",
    imageAlt: "Hình minh họa hệ thống điện mặt trời quy mô doanh nghiệp",
    note: "Nội dung giới thiệu sơ bộ. Phạm vi kỹ thuật, thiết bị, chi phí, tiến độ và yêu cầu tuân thủ cần được xác định theo từng công trình.",
    considerations: [
      { title: "Phụ tải và lịch sản xuất", text: "Dữ liệu tiêu thụ theo thời gian giúp đánh giá mức độ phù hợp với nhu cầu vận hành của nhà máy." },
      { title: "Hạ tầng và mặt bằng", text: "Kết cấu mái, hệ thống điện hiện hữu và điều kiện tiếp cận công trình cần được khảo sát." },
      { title: "Yêu cầu dự án", text: "Phạm vi EPC, hồ sơ kỹ thuật và các yêu cầu đấu nối, an toàn hoặc PCCC cần đối chiếu theo công trình và quy định áp dụng." },
    ],
    steps: [
      { title: "Rà soát dữ liệu", text: "Tiếp nhận hồ sơ phụ tải, lịch sản xuất và thông tin hạ tầng hiện hữu." },
      { title: "Khảo sát kỹ thuật", text: "Đánh giá mặt bằng, kết cấu, hệ thống điện và yêu cầu phối hợp của doanh nghiệp." },
      { title: "Thống nhất phạm vi", text: "Xác định giải pháp kỹ thuật, hồ sơ và tiến độ sau khi hoàn tất bước đánh giá." },
    ],
  },
} satisfies Record<string, SolutionDetail>;
export const solutionOverviewContent = {
  hero: {
    title: "Giải pháp điện mặt trời",
    description: "Dù là nhà ở, cửa hàng, văn phòng hay nhà xưởng, chúng tôi đều có giải pháp phù hợp với đặc điểm sử dụng điện và mục tiêu đầu tư của bạn.",
    primaryLabel: "Tư vấn giải pháp",
    primaryHref: "#needs",
    secondaryLabel: "Khảo sát miễn phí",
    secondaryHref: "/khao-sat/",
  },
  needs: {
    title: "Đâu là nhu cầu của gia đình bạn?",
    description: "Lúa Xanh Đồng Bằng sẽ giúp bạn phân tích, thiết kế và đề xuất giải pháp phù hợp với công trình dựa trên nhu cầu sử dụng điện của gia đình/cơ sở kinh doanh của bạn.",
    items: [
      { title: "Giảm tiền điện hàng tháng", description: "Tận dụng điện mặt trời ngay khi được tạo ra." },
      { title: "Sử dụng nhiều điện vào buổi tối", description: "Lưu lại điện tạo ra ban ngày để dùng cho buổi tối." },
      { title: "Cần điện dự phòng khi mất điện", description: "Duy trì các thiết bị quan trọng trong gia đình hoặc cơ sở kinh doanh." },
      { title: "Công trình có mái lớn và sử dụng nhiều điện", description: "Tối ưu chi phí vận hành dài hạn." },
      { title: "Chưa biết nên lắp bao nhiêu là đủ", description: "Đội ngũ sẽ phân tích và đề xuất công suất phù hợp." },
    ],
  },
  systems: {
    title: "Giải pháp phù hợp với từng nhu cầu",
    description: "Mỗi công trình có đặc điểm sử dụng điện khác nhau. Dưới đây là các giải pháp phổ biến và cách chúng hoạt động.",
    items: [
      {
        title: "Hệ hòa lưới bám tải",
        scenario: "Giảm tiền điện ban ngày",
        description: "Điện mặt trời được tạo ra vào ban ngày và ưu tiên sử dụng trực tiếp cho các thiết bị trong nhà. Khi điện mặt trời không đủ, hệ thống tự động lấy thêm điện từ lưới để đáp ứng nhu cầu sử dụng.",
        benefits: ["Giảm lượng điện mua từ lưới", "Tận dụng nguồn điện ngay khi có nắng", "Chi phí đầu tư phù hợp"],
        audiences: ["Nhà ở", "Cửa hàng", "Văn phòng", "Xưởng sản xuất"],
      },
      {
        title: "Hệ hòa lưới lưu trữ",
        scenario: "Dùng điện buổi tối",
        description: "Ban ngày, điện mặt trời được ưu tiên sử dụng cho các thiết bị trong nhà; phần năng lượng phù hợp có thể được lưu vào pin. Khi không còn nắng, pin có thể cung cấp lại nguồn điện đã lưu trữ, và điện lưới sẽ bổ sung khi cần.",
        benefits: ["Sử dụng điện mặt trời cả vào buổi tối", "Tăng tỉ lệ tự dùng, giảm tiền điện", "Phù hợp với gia đình và cơ sở kinh doanh"],
        audiences: ["Nhà ở", "Nhà hàng", "Cửa hàng", "Văn phòng"],
      },
      {
        title: "Hệ thống kết hợp pin lưu trữ dự phòng",
        scenario: "Chủ động khi mất điện",
        description: "Hệ thống được thiết kế để pin lưu trữ có thể cấp điện cho các thiết bị ưu tiên khi nguồn điện lưới bị gián đoạn. Gia đình có thể lựa chọn những thiết bị cần duy trì như chiếu sáng, Wi-Fi, camera, tủ lạnh hoặc các tải thiết yếu khác.",
        benefits: ["Duy trì các thiết bị thiết yếu khi mất điện", "Tăng khả năng chủ động nguồn điện", "Linh hoạt theo nhu cầu thực tế"],
        audiences: ["Nhà ở", "Cửa hàng", "Văn phòng", "Xưởng sản xuất"],
      },
    ],
  },
  buildingTypes: {
    title: "Có thể áp dụng cho nhiều loại công trình",
    description: "Dù là nhà ở, cửa hàng hay nhà xưởng, chúng tôi đều có giải pháp phù hợp với đặc điểm sử dụng điện và mục tiêu đầu tư của bạn.",
    items: [
      { anchor: "household", title: "Nhà ở & biệt thự", description: "Giảm tiền điện, tận dụng mái nhà, tăng tính chủ động." },
      { anchor: "small-business", title: "Cửa hàng & kinh doanh", description: "Tối ưu chi phí điện trong giờ hoạt động." },
      { title: "Văn phòng & dịch vụ", description: "Giải pháp linh hoạt theo nhu cầu sử dụng." },
      { anchor: "enterprise", title: "Nhà xưởng & sản xuất", description: "Công suất lớn, thiết kế theo phụ tải thực tế." },
    ],
  },
  process: {
    title: "Quy trình tư vấn & triển khai",
    description: "Quy trình triển khai chuẩn EPC (Thiết kế - Mua sắm - Thi công) gồm các bước chính từ khảo sát, thiết kế kỹ thuật, mua sắm vật tư, thi công xây lắp, chạy thử cho đến nghiệm thu và bàn giao công trình cho chủ đầu tư.",
    steps: [
      {
        title: "Khảo sát đo đạc hiện trạng",
        turnaround: "Trong vòng 24 giờ sau khi tiếp nhận yêu cầu",
        tasks: ["Đo góc nghiêng và diện tích khả dụng của mặt bằng mái.", "Kiểm tra kết cấu chịu lực.", "Ghi nhận hướng nắng, thời lượng giờ nắng và bóng râm.", "Phân tích biểu đồ phụ tải và lịch sử 12 tháng của hóa đơn tiền điện EVN gần nhất."],
      },
      {
        title: "Mô phỏng & thiết kế giải pháp",
        turnaround: "1–2 ngày làm việc sau khi khảo sát",
        tasks: ["Mô phỏng đường đi mặt trời và bóng đổ.", "Lựa chọn cấu hình tấm pin và phân bổ số lượng MPPT của biến tần tối ưu.", "Thiết kế sơ đồ nguyên lý và phương án bảo vệ chống sét lan truyền.", "Lập bảng tính hoàn vốn chi tiết."],
      },
      {
        title: "Thi công & lắp đặt chuẩn hóa",
        turnaround: null,
        tasks: ["Khung nhôm chống ăn mòn, phù hợp môi trường ven sông.", "Bộ kẹp và liên kết chuyên dụng, đảm bảo chắc chắn và chống dột mái.", "Cáp Solar DC chống cháy, đi trong ống bảo vệ chịu tia UV.", "Kiểm tra hệ thống tiếp địa, đảm bảo điện trở < 4Ω cho hệ thống điện và < 10Ω cho chống sét."],
      },
      {
        title: "Đồng hành giám sát & bảo hành",
        turnaround: "Bàn giao trong 1 ngày, theo dõi đồng hành 25 năm",
        tasks: ["Cài đặt ứng dụng giám sát thời gian thực trên Smartphone.", "Nhân sự phụ trách tình huống khẩn cấp và bảo dưỡng tấm pin định kỳ.", "Bàn giao đầy đủ hồ sơ hoàn công, catalog thiết bị, chứng thư bảo hành chính hãng.", "Định kỳ 6 tháng một lần kỹ thuật viên đến kiểm tra siết bulong và đo dòng điện."],
      },
    ],
  },
  investment: {
    title: "Mô hình hợp tác đầu tư",
    description: "Linh hoạt phương án tài chính theo quy mô công trình.",
    models: [
      {
        badge: "Phổ biến",
        title: "Tự đầu tư 100% (Tự sản tự tiêu)",
        fit: "Hộ gia đình, chủ xưởng có nguồn vốn sẵn, muốn hoàn vốn nhanh nhất (3.5 – 5 năm).",
        terms: [
          { label: "Vốn đầu tư", value: "Tự chi trả" },
          { label: "Thời gian thu hồi vốn", value: "3.5 – 4.8 năm" },
          { label: "Vận hành O&M", value: "Dịch vụ hậu mãi theo thỏa thuận hợp đồng." },
        ],
      },
      {
        title: "Cho thuê thiết bị / Hợp tác mái",
        fit: "Doanh nghiệp có diện tích mái lớn, ưu tiên tận dụng tài sản có sẵn để tạo thêm nguồn thu cho hoạt động kinh doanh cốt lõi.",
        terms: [
          { label: "Vốn đầu tư", value: "0 VNĐ (Quỹ đầu tư chi trả)" },
          { label: "Thời gian thu hồi vốn", value: "Có lợi ngay từ tháng đầu tiên" },
          { label: "Vận hành O&M", value: "Trọn gói do đơn vị đầu tư chịu trách nhiệm 100%." },
        ],
      },
      {
        title: "Mua bán điện trực tiếp",
        fit: "Nhà máy sản xuất lớn, cần đáp ứng quy chuẩn kiểm kê khí nhà kính và chứng chỉ môi trường.",
        terms: [
          { label: "Vốn đầu tư", value: "Linh hoạt theo hợp đồng" },
          { label: "Thời gian thu hồi vốn", value: "Cố định đơn giá điện dài hạn" },
          { label: "Vận hành O&M", value: "Vận hành đạt chuẩn kiểm toán quốc tế." },
        ],
      },
    ],
  },
  closing: {
    title: "Sẵn sàng tìm giải pháp cho công trình của bạn",
    description: "Đội ngũ kỹ thuật sẽ liên hệ và tư vấn trong 48 giờ.",
    actionLabel: "Hẹn lịch khảo sát miễn phí",
    actionHref: "/khao-sat/",
  },
} as const;
