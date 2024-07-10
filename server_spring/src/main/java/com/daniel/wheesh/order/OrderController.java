package com.daniel.wheesh.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {
    private final OrderService service;

    @GetMapping("/paid")
    private ResponseEntity<OrdersResponse> getPaidOrders() throws Exception {
        return ResponseEntity.ok(service.getPaidOrders());
    }

    @GetMapping("/history")
    private ResponseEntity<OrdersResponse> getHistoryOrders() throws Exception {
        return ResponseEntity.ok(service.getHistoryOrders());
    }

    @GetMapping("/unpaid")
    private ResponseEntity<OrdersResponse> getUnpaidOrders() throws Exception {
        return ResponseEntity.ok(service.getUnpaidOrders());
    }

    @PostMapping
    private ResponseEntity<CreateOrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createOrder(request));
    }

    @GetMapping("/{orderId}")
    private ResponseEntity<OneOrderResponse> getOneOrder(@PathVariable("orderId") Long orderId) throws Exception {
        return ResponseEntity.ok(service.getOneOrder(orderId));
    }

    @PutMapping("/{orderId}")
    private ResponseEntity<UpdateOrderResponse> payOrder(@PathVariable("orderId") Long orderId) throws Exception {
        return ResponseEntity.ok(service.payOrder(orderId));
    }

    @DeleteMapping("/{orderId}")
    private ResponseEntity<DeleteOrderResponse> cancelOrder(@PathVariable("orderId") Long orderId) throws Exception {
        return ResponseEntity.ok(service.cancelOrder(orderId));
    }

    @PostMapping("/validateDepart")
    private ResponseEntity<ValidateTicketResponse> validateDepartureTicket(
        @Valid @RequestBody ValidateDepartureTicketRequest request
    ) {
        return ResponseEntity.ok(service.validateDepartureTicket(request));
    }

    @PostMapping("/validateArrive")
    private ResponseEntity<ValidateTicketResponse> validateArrivalTicket(
        @Valid @RequestBody ValidateArrivalTicketRequest request
    ) {
        return ResponseEntity.ok(service.validateArrivalTicket(request));
    }
}
