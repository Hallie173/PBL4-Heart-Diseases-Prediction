import React, { Component } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const ECG = () => {
  const ECGdata = [
    287, 287, 289, 293, 299, 305, 308, 309, 308, 305, 300, 292, 285, 278, 274,
    272, 272, 275, 297, 293, 269, 274, 296, 288, 265, 274, 297, 287, 266, 278,
    298, 285, 270, 288, 301, 281, 270, 295, 303, 281, 275, 299, 305, 282, 278,
    302, 302, 280, 286, 309, 302, 279, 288, 310, 301, 281, 295, 314, 300, 284,
    301, 314, 294, 285, 307, 315, 292, 286, 311, 314, 290, 290, 312, 310, 288,
    293, 316, 309, 285, 296, 317, 307, 288, 304, 320, 301, 286, 305, 320, 301,
    288, 310, 321, 298, 290, 312, 315, 293, 294, 319, 319, 293, 297, 320, 312,
    291, 302, 323, 311, 292, 305, 321, 306, 293, 311, 323, 303, 295, 314, 321,
    300, 296, 320, 324, 300, 299, 324, 324, 302, 302, 321, 322, 312, 323, 335,
    316, 299, 316, 329, 305, 287, 308, 321, 302, 293, 312, 318, 296, 292, 315,
    317, 294, 294, 318, 315, 284, 285, 318, 331, 370, 481, 617, 630, 560, 508,
    463, 383, 319, 306, 310, 290, 279, 299, 303, 278, 271, 295, 298, 277, 282,
    310, 307, 283, 292, 315, 308, 289, 302, 324, 313, 297, 314, 333, 316, 305,
    326, 341, 323, 315, 337, 347, 328, 330, 357, 361, 338, 343, 369, 369, 349,
    358, 382, 373, 353, 369, 390, 374, 357, 376, 389, 365, 351, 367, 372, 346,
    336, 356, 354, 328, 326, 353, 354, 328, 329, 353, 350, 329, 338, 361, 350,
    329, 343, 363, 348, 332, 352, 367, 347, 335, 354, 362, 342, 339, 363, 364,
    338, 336, 360, 360, 334, 339, 366, 358, 335, 343, 363, 352, 331, 344, 363,
    349, 333, 351, 364, 346, 336, 357, 365, 340, 333, 356, 361, 339, 338, 361,
    355, 329, 337, 364, 357, 332, 337, 358, 350, 333, 345, 362, 347, 332, 350,
    362, 344, 332, 352, 361, 341, 334, 355, 358, 338, 340, 362, 358, 335, 346,
    370, 356, 335, 356, 383, 366, 340, 354, 372, 351, 332, 348, 360, 342, 332,
    356, 362, 338, 332, 354, 357, 334, 334, 357, 355, 330, 330, 347, 348, 338,
    390, 501, 615, 646, 644, 614, 518, 432, 391, 363, 322, 312, 331, 331, 303,
    299, 322, 325, 302, 304, 328, 325, 303, 308, 332, 327, 308, 320, 340, 324,
    308, 325, 340, 325, 314, 335, 344, 323, 316, 338, 343, 320, 318, 344, 346,
    320, 320, 347, 346, 324, 334, 356, 345, 327, 341, 363, 350, 331, 346, 361,
    343, 329, 345, 351, 327, 318, 337, 338, 312, 306, 328, 328, 304, 308, 332,
    327, 303, 312, 335, 326, 303, 313, 333, 320, 305, 322, 336, 316, 303, 325,
    334, 312, 305, 326, 330, 306, 305, 329, 330, 304, 306, 330, 325, 302, 308,
    329, 320, 301, 314, 332, 315, 297, 314, 330, 313, 300, 319, 330, 307, 299,
    323, 327, 304, 300, 325, 326, 304, 305, 327, 322, 301, 308, 330, 319, 300,
    314, 332, 316, 300, 319, 334, 316, 304, 324, 333, 313, 309, 335, 337, 309,
    311, 345, 345, 315, 314, 334, 327, 302, 304, 320, 308, 289, 303, 321, 304,
    287, 303, 317, 297, 286, 307, 315, 294, 285, 302, 301, 287, 303, 377, 471,
    574, 636, 618, 539, 444, 377, 340, 295, 270, 287, 298, 274, 254, 273, 287,
    266, 254, 278, 288, 267, 262, 286, 288, 265, 268, 293, 292, 269, 274, 298,
    289, 266, 280, 302, 290, 271, 287, 305, 289, 275, 294, 308, 289, 282, 307,
    316, 292, 288, 314, 321, 300, 302, 326, 324, 303, 308, 333, 324, 301, 310,
    328, 313, 291, 302, 315, 296, 281, 300, 313, 290, 281, 302, 308, 288, 285,
    308, 308, 286, 290, 315, 312, 290, 298, 321, 313, 292, 301, 319, 307, 293,
    309, 324, 306, 292, 312, 323, 301, 294, 317, 324, 301, 298, 323, 324, 299,
    301, 324, 320, 297, 307, 331, 321, 296, 307, 328, 316, 300, 316, 328, 310,
    300, 322, 332, 310, 303, 325, 329, 307, 304, 328, 330, 306, 308, 332, 328,
    305, 311, 332, 323, 304, 317, 335, 321, 305, 321, 334, 314, 303, 324, 333,
    312, 305, 325, 329, 308, 309, 335, 334, 313, 315, 337, 336, 324, 331, 346,
    330, 309, 323, 338, 317, 299, 316, 329, 310, 300, 319, 328, 307, 301, 324,
    327, 303, 301, 327, 326, 299, 294, 320, 327, 340, 425, 565, 644, 622, 569,
    516, 425, 339, 316, 316, 301, 287, 301, 302, 278, 273, 299, 302, 279, 278,
    302, 299, 276, 284, 310, 304, 283, 293, 313, 302, 283, 298, 317, 303, 290,
    308, 321, 302, 295, 316, 323, 302, 300, 326, 327, 303, 306, 334, 333, 311,
    317, 342, 336, 316, 329, 350, 337, 321, 338, 353, 335, 319, 333, 340, 316,
    304, 324, 331, 306, 300, 322, 324, 300, 300, 325, 322, 298, 305, 328, 319,
    298, 308, 327, 315, 298, 315, 329, 312, 300, 321, 333, 311, 300, 322, 328,
    306, 301, 323, 325, 303, 304, 326, 322, 298, 303, 324, 315, 298, 311, 328,
    314, 295, 311, 328, 310, 297, 316, 326, 305, 297, 318, 323, 299, 298, 324,
    324, 301, 304, 327, 320, 297, 307, 332, 322, 303, 311, 330, 316, 299, 315,
    327, 311, 301, 320, 328, 305, 299, 324, 329, 306, 305, 328, 327, 304, 309,
    333, 325, 301, 308, 331, 322, 304, 316, 332, 318, 305, 326, 341, 318, 306,
    337, 353, 327, 312, 331, 337, 315, 310, 330, 328, 304, 307, 330, 326, 305,
    314, 335, 323, 304, 320, 339, 323, 308, 321, 327, 310, 311, 361, 442, 532,
    629, 644, 599, 500, 433, 401, 356, 303, 297, 322, 313, 288, 295, 312, 297,
    280, 297, 316, 300, 285, 304, 318, 302, 293, 316, 324, 301, 299, 323, 325,
    303, 305, 332, 330, 307, 312, 335, 329, 310, 320, 341, 330, 315, 331, 349,
    335, 324, 345, 360, 341, 331, 353, 363, 342, 339, 363, 364, 339, 339, 362,
    354, 328, 331, 351, 341, 318, 328, 345, 328, 310, 328, 346, 327, 312, 331,
    342, 322, 314, 334, 341, 319, 317, 342, 342, 317, 319, 344, 341, 318, 325,
    345, 333, 311, 324, 345, 330, 311, 328, 344, 325, 310, 330, 341, 322, 312,
    333, 338, 314, 312, 336, 338, 313, 316, 338, 331, 308, 317, 341, 331, 310,
    322, 338, 322, 306, 326, 340, 322, 309, 328, 336, 316, 310, 333, 338, 315,
    312, 334, 333, 310, 315, 338, 333, 310, 318, 339, 329, 311, 323, 340, 324,
    307, 324, 339, 322, 312, 334, 346, 325, 317, 336, 345, 331, 332, 348, 338,
    314, 321, 341, 329, 302, 310, 332, 322, 304, 317, 334, 316, 301, 321, 335,
    314, 302, 324, 333, 308, 294, 321, 337, 351, 434, 580, 646, 625, 563, 507,
    431, 347, 316, 318, 307, 287, 296, 309, 289, 273, 292, 306, 286, 273, 295,
    306, 284, 281, 306, 309, 286, 288, 312, 308, 286, 292, 317, 308, 287, 298,
    318, 306, 288, 306, 324, 309, 294, 313, 326, 308, 304, 328, 338, 317, 314,
    338, 341, 319, 322, 348, 344, 322, 328, 350, 340, 317, 326, 343, 327, 307,
    320, 332, 314, 301, 319, 329, 308, 301, 324, 331, 307, 304, 329, 330, 307,
    311, 336, 331, 308, 314, 335, 326, 307, 320, 338, 322, 304, 322, 336, 319,
    308, 329, 340, 319, 311, 332, 336, 313, 311, 337, 338, 313, 318, 343, 335,
    312, 323, 346, 336, 315, 330, 348, 336, 321, 337, 351, 335, 326, 348, 358,
    338, 332, 355, 362, 339, 339, 364, 363, 342, 347, 374, 369, 349, 358, 379,
    369, 350, 364, 384, 368, 353, 372, 388, 370, 359, 381, 386, 364, 359, 384,
    389, 363, 361, 385, 382, 359, 362, 385, 377, 358, 372, 395, 377, 350, 375,
    405, 387, 363, 373, 384, 366, 354, 369, 372, 348, 344, 367, 368, 344, 340,
    363, 362, 341, 345, 367, 358, 335, 344, 357, 338, 327, 358, 428, 505, 613,
    647, 638, 563, 477, 427, 379, 324, 313, 337, 334, 301, 294, 316, 314, 290,
    295, 317, 310, 289, 300, 320, 306, 288, 302, 318, 301, 289, 307, 317, 298,
    290, 310, 315, 293, 293, 318, 319, 293, 297, 321, 318, 297, 304, 326, 317,
    299, 312, 332, 321, 306, 323, 337, 320, 309, 329, 338, 316, 307, 327, 329,
    302, 296, 316, 313, 287, 288, 310, 303, 280, 287, 308, 299, 279, 291, 311,
    297, 282, 298, 313, 295, 283, 303, 313, 293, 287, 311, 315, 290, 287, 312,
    312, 286, 290, 315, 308, 284, 292, 314, 303, 284, 299, 316, 301, 284, 301,
    314, 296, 285, 305, 315, 292, 285, 309, 311, 288, 288, 312, 309, 284, 290,
    312, 305, 284, 295, 315, 302, 282, 297, 315, 299, 286, 305, 316, 296, 286,
    310, 316, 294, 287, 311, 314, 290, 291, 315, 312, 290, 295, 318, 311, 287,
    297, 316, 305, 289, 306, 322, 304, 290, 308, 321, 303, 294, 315, 322, 300,
    297, 319, 323, 300, 303, 332, 328, 301, 307, 340, 338, 314, 320, 336, 324,
    304, 316, 328, 312, 300, 321, 333, 311, 302, 324, 329, 307, 305, 330, 330,
    303, 305, 331, 321, 299, 316, 367, 428, 518, 634, 644, 585, 492, 441, 396,
    330, 287, 304, 316, 290, 275, 293, 296, 275, 274, 297, 295, 272, 279, 304,
    298, 275, 282, 305, 296, 278, 291, 310, 296, 282, 300, 314, 299, 289, 308,
    318, 299, 294, 319, 326, 305, 306, 329, 330, 309, 313, 338, 335, 317, 328,
    349, 336, 316, 333, 353, 336, 318, 334, 345, 325, 313, 327, 331, 306, 300,
    323, 327, 303, 300, 326, 325, 302, 307, 332, 323, 300, 310, 332, 322, 304,
    317, 333, 319, 309, 328, 339, 316, 308, 333, 340, 317, 311, 332, 336, 312,
    311, 332, 329, 308, 314, 338, 331, 312, 322, 342, 327, 306, 321, 339, 323,
    308, 324, 336, 318, 311, 333, 336, 312, 310, 334, 336, 314, 317, 340, 337,
    312, 317, 340, 333, 311, 322, 343, 330, 311, 327, 345, 327, 312, 331, 343,
    323, 315, 334, 339, 318, 315, 338, 341, 318, 324, 349, 338, 316, 336, 364,
    348, 320, 330, 349, 333, 312, 322, 335, 320, 309, 329, 338, 318, 310, 333,
    336, 313, 313, 340, 339, 314, 314, 331, 328, 317, 350, 438, 538, 630, 644,
    618, 534, 447, 403, 369, 317, 299, 323, 328, 300, 291, 313, 317, 293, 292,
    318, 317, 293, 296, 321, 316, 295, 306, 326, 314, 296, 312, 330, 315, 301,
    320, 333, 313, 304, 325, 333, 310, 306, 331, 336, 314, 314, 340, 338, 316,
    323, 348, 343, 321, 331, 353, 341, 322, 337, 354, 337, 321, 337, 346,
  ];

  // Tạo dữ liệu có đánh số index
  const formattedData = ECGdata.map((value, index) => ({
    index: index + 1,
    ECGValue: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedData}>
        <Line
          type="monotone"
          dataKey="ECGValue"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ECG;