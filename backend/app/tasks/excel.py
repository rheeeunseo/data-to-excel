from datetime import datetime, timezone
from pathlib import Path

from openpyxl import Workbook
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Job, Order


EXPORT_DIR = Path("/app/exports")
EXPORT_DIR.mkdir(parents=True, exist_ok=True)

CHUNK_SIZE = 5000


def generate_excel_task(job_id: int) -> None:
    db: Session = SessionLocal()

    try:
        db.query(Job).filter(Job.id == job_id).update({
            "status": "processing",
            "started_at": datetime.now(timezone.utc),
            "progress": 0,
        })
        db.commit()

        file_path = EXPORT_DIR / f"orders_{job_id}.xlsx"

        total_count = db.query(func.count(Order.id)).scalar() or 1

        workbook = Workbook(write_only=True)
        sheet = workbook.create_sheet(title="orders")

        sheet.append([
            "id",
            "user_name",
            "product_name",
            "category",
            "amount",
            "status",
            "order_date",
        ])

        last_id = 0
        processed = 0

        while True:
            orders = (
                db.query(Order)
                .filter(Order.id > last_id)
                .order_by(Order.id)
                .limit(CHUNK_SIZE)
                .all()
            )

            if not orders:
                break

            for order in orders:
                sheet.append([
                    order.id,
                    order.user_name,
                    order.product_name,
                    order.category,
                    order.amount,
                    order.status,
                    order.order_date.strftime("%Y-%m-%d %H:%M:%S") if order.order_date else "",
                ])

            processed += len(orders)
            last_id = orders[-1].id

            progress = min(int(processed / total_count * 100), 99)
            db.query(Job).filter(Job.id == job_id).update({"progress": progress})
            db.commit()

        workbook.save(file_path)

        db.query(Job).filter(Job.id == job_id).update({
            "status": "done",
            "progress": 100,
            "completed_at": datetime.now(timezone.utc),
            "file_path": str(file_path),
        })
        db.commit()

    except Exception as e:
        db.query(Job).filter(Job.id == job_id).update({
            "status": "failed",
            "completed_at": datetime.now(timezone.utc),
            "error_msg": str(e),
        })
        db.commit()
        raise

    finally:
        db.close()
