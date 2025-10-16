// app/page.tsx

"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Vaccine from '@/public/vaccine.png';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showSuggestion, setShowSuggestion] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {!showSuggestion ? (
          <div>
            <div className="text-center font-bold text-xl md:text-2xl mb-8">
              แบบประเมินความเสี่ยงในการเป็นไข้เลือดออก<br />
              Dengue Assessment Form
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="text-center">
                    <div className="mb-2">
                      <Image
                        src={Vaccine}
                        alt="vaccine"
                        width={180}
                        height={180}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="text-lg md:text-xl font-bold mb-4 text-center md:text-left">
                    คำแนะนำการให้วัคซีนป้องกันโรคไข้เลือดออก<br />
                    บริษัท ทาเคดา (ประเทศไทย) จำกัด
                  </div>

                  <div className="text-sm mb-6">
                    ที่อยู่: 57 อาคารปาร์คเวนเชอร์ อีโคเพล็กซ์ ชั้น 15<br />
                    ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน<br />
                    กรุงเทพฯ 10330 ประเทศไทย<br />
                    โทรศัพท์: 0-2697-9300
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white py-3 px-8 rounded-lg text-lg transition-colors"
                  onClick={() => setShowSuggestion(true)}
                >
                  เข้าสู่แบบประเมิน
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center font-bold text-2xl mb-4">คำชี้แจง</div>
            <div className="text-lg mb-6 leading-relaxed">
              แบบประเมินนี้จัดทำขึ้นเพื่อช่วยประเมินความเหมาะสมในการรับวัคซีนไข้เลือดออกเด็งกี่ โดยคำแนะนำนี้เป็นเพียงข้อมูลเบื้องต้นเพื่อพิจารณาความเหมาะสมในการรับวัคซีน และข้อมูลในเอกสารฉบับนี้จัดทำขึ้นสำหรับประชาชนเป็นการทั่วไปโดยมีวัตถุประสงค์เพื่อเป็นการให้ข้อมูลเท่านั้น ข้อมูลนี้ไม่ควรถูกนำไปใช้เพื่อวินิจฉัยหรือรักษาปัญหาสุขภาพหรือโรคใด ๆ การให้ข้อมูลดังกล่าวนี้ไม่มีวัตถุประสงค์เป็นการทดแทน ควรปรึกษากับผู้ให้บริการทางการแพทย์ โปรดปรึกษาผู้ให้บริการทางการแพทย์ ของท่านสำหรับคำแนะนำเพิ่มเติม
            </div>
            <div className="text-sm mb-8 italic">
              อ้างอิง สมาคมโรคติดเชื้อแห่งประเทศไทย, คำแนะนำการให้วัคซีนป้องกันโรคสำหรับผู้ใหญ่และผู้สูงอายุ พ.ศ. 2568
            </div>
            <div className="flex justify-center">
              <Link href="/assessment">
                <Button
                  type="button"
                  className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white py-3 px-8 rounded-lg text-lg transition-colors"
                >
                  เริ่มทำแบบประเมิน
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}