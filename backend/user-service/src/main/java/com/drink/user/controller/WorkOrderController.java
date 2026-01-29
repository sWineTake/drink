package com.drink.user.controller;

import com.drink.user.dto.DefectDto;
import com.drink.user.dto.MachineDto;
import com.drink.user.dto.ProductionDto;
import com.drink.user.dto.WorkOrdersRequest;
import com.drink.user.service.WorkOrderService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    @GetMapping
    public ResponseEntity<?> getWorkOrders(WorkOrdersRequest workOrdersRequest) {
        log.info(workOrdersRequest.toString());
        return ResponseEntity.ok(workOrderService.findByStatusAndDate(workOrdersRequest));
    }

    @PostMapping("/machines")
    public ResponseEntity<?> registerMachine(@RequestBody MachineDto machineDto) {
        // return ResponseEntity.ok(machineService.register(machineDto));

        log.info(machineDto.toString());
        return ResponseEntity.ok().build();
    }

    // Todo) 컨트롤러 수정 필요
    @GetMapping("/workers/{workerId}")
    public ResponseEntity<?> getWorkerDetail(@PathVariable(name = "workerId") Long id) {
        // return ResponseEntity.ok(workerService.findById(id));
        log.info("request id {}", id );
        return null;
    }

    @GetMapping("/production")
    public ResponseEntity<?> getProduction(ProductionDto dto) {
        // 프론트에서는 product_code, min_quantity로 보냄
        log.info("getProduction-request info : {}", dto.toString());
        return null;
    }

    @PostMapping("/defects/batch")
    public ResponseEntity<?> registerDefects(@RequestBody List<DefectDto> defects) {
        log.info(defects.toString());
        return null;
    }

}
